const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { addRequest, getRequests } = require("./requests.controller");
const { addUser, loginUser } = require("./users.controller");
const auth = require("./middlewares/auth");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express App",
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);

    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express App",
        error: "Email is already registered",
      });

      return;
    }
    res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });

  res.redirect("/login");
});

app.get("/requests", async (req, res) => {
  res.render("requests", {
    title: "Заявки с формы",
    requests: await getRequests(),
    created: false,
    error: false,
  });
});

app.use(auth);

app.get("/", async (req, res) => {
  res.render("request", {
    title: "Запись к врачу",
    created: false,
    error: false,
  });
});

app.post("/", async (req, res) => {
  try {
    await addRequest(
      req.body.fullName,
      req.body.phoneNumber,
      req.body.requestText,
      req.user.email
    );
    res.render("request", {
      title: "Запись к врачу",
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Creation error", e);
    res.render("request", {
      title: "Запись к врачу",
      created: false,
      error: true,
    });
  }
});

app.get("/", async (req, res) => {
  res.render("requests", {
    title: "Заявки с формы",
    requests: await getRequests(),
    created: false,
    error: false,
  });
});

mongoose
  .connect(
    "mongodb+srv://morozcuporos:121354As@cluster0.d8xe1od.mongodb.net/requests?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
