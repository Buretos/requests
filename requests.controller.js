const Request = require("./models/Request");

async function addRequest(fullName, phoneNumber, requestText, owner) {
  await Request.create({ fullName, phoneNumber, requestText, owner });
}

async function getRequests() {
  const requests = await Request.find();

  return requests;
}
module.exports = { addRequest, getRequests };
