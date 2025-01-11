const { MailtrapClient } = require("mailtrap");
require('dotenv').config();

const TOKEN = process.env.MAIL_TRAP_TOKEN;
const ENDPOINT = process.env.ENDPOINT;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT
});

module.exports.mailtrap = mailtrapClient;

module.exports.sender = {
  email: "hello@demomailtrap.com",
  name: "SAILESH",
};
