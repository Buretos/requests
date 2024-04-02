const mongoose = require("mongoose");
const validator = require("validator");

const requestSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: validator.isMobilePhone,
      message: "Is not a valid phone number!",
    },
  },
  requestText: {
    type: String,
    required: false,
  },
  owner: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
