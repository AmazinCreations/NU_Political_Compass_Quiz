require("dotenv").config();

const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;
const express = require("express");
const path = require("path");

const app = express();

const nodemailer = require("nodemailer");

const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
// app.use(express.urlencoded());
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/", function (req, res) {
  console.log("req", req.body);
  console.log(req.body.email, req.body.title, req.body.body);
  sendEmail(req.body.email, req.body.title, req.body.body);
});

function sendEmail(recipient, title, body) {
  return mailjet
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "thesupremelordcommander@outlook.com",
            Name: "thesupremelordcommander@outlook.com",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: title,
          TextPart: body,
          HTMLPart: body,
        },
      ],
    })
    .then((result) => {
      // do something with the send result or ignore
      console.log("sucuess email");
    })
    .catch((err) => {
      // handle an error
      console.log("email fail");
    });
}

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  //sendEmail("artnos@gmail.com","new Title","<h1>hello there</h1><div>more stuff</div>")
}

main().catch(console.error);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
