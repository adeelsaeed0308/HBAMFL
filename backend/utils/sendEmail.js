const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Email = require("../models/Email");
dotenv.config({ path: "./config/config.env" });
const isReadableStream = require("./isStream");
const { getSite } = require("./isKanda");

module.exports = async function (args) {
  let {
    to,
    subject,
    text,
    html,
    cc = "",
    bcc = "",
    fromEmail,
    fromName,
    attachment,
  } = args;

  if (process.env.SEND_EMAILS == 0) {
    return Promise.resolve({});
  }

  if (attachment?.content && isReadableStream(attachment.content)) {
    await new Promise((r) => {
      const bufs = [];
      attachment.content.on("data", function (d) {
        bufs.push(d);
      });
      attachment.content.on("end", function () {
        attachment.content = Buffer.concat(bufs);
        r();
      });
    });
  }
  Email.create({ ...args, attachmentContent: attachment?.content });
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
      return transporter.sendMail({
      from: `"${fromName || getSite() + " Brands System"}" <${
        fromEmail || process.env.FROM_EMAIL
      }>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
      cc,
      bcc,
      attachments: attachment ? [attachment] : undefined,
    });
  };
// module.exports({
//   to: "meilechwieder@gmail.com",
//   subject: "hi",
//   text: "dd",
// });
