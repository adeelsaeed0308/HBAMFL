const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const docs = require("express-mongoose-docs");
const mongoose = require("mongoose");
const path = require("path");
const { scheduleJob } = require("node-schedule");
const cleanCodes = require("./crons/clearVerificationCodes");
const moveVendorRequestToFollowUp = require("./crons/moveVendorRequestToFollowUp");

mongoose.set("strictQuery", false);
//important: https://github.com/Automattic/mongoose/issues/10781

dotenv.config({ path: "./config/config.env" });
require("./db");

const app = express();
const server = http.createServer(app);

const router = require("./routes");
const { sendVendorRequestsStatusChangesNDaysNoChangeReminder } = require("./controllers/sourcing");

app.use(
  require("cors")({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "token",
    ],
  })
);

app.disable("etag");

app.use(express.urlencoded({ extended: true }));

app.set("x-powered-by", false);

app.use(express.json());
app.use(cookieParser());

// setup the logger
const options =
  process.env.NODE_ENV === "production" && process.env.LOG_FILE_LOCATION
    ? [
        "combined",
        {
          stream: fs.createWriteStream(process.env.LOG_FILE_LOCATION, {
            flags: "a",
          }),
        },
      ]
    : ["dev"];
app.use(morgan(...options));

//mongo sanitizer
app.use(mongoSanitize());

//hpp
app.use(hpp());

//docs
if (process.env.NODE_ENV === "development") {
  docs(app, mongoose);
  app.use("/docs", express.static(path.join(__dirname, "docs")));
}

app.get(/.*/, function (req, res, next) {
  if (process.env.NODE_ENV !== "production") return next();
  const host = req.header("host");
  if (
    host.match(/www\.workportal\.app/i) ||
    host.match(/kandagroup\.herokuapp\.com/)
  ) {
    next();
  } else {
    res.redirect(301, "//www.workportal.app" + req.url);
  }
});

//routes
app.use("/api", router);

app.use(
  express.static("../frontend/build", {
    extensions: ["html"],
  })
);

app.use("*", function (request, response) {
  response.sendFile(
    path.resolve(__dirname, "..", "frontend", "build", "index.html")
  );
});

//errorHandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const serverVar = server.listen(
  PORT,
  console.log(`Server running ${process.env.NODE_ENV} on port ${PORT}`)
);

process.on("unhandledRejection", (e, p) => {
  console.log(`Unhandled promise rejection: ${e?.message}`);
  scheduleJob("0 12 * * *", cleanCodes);
});

scheduleJob("0 12 * * *", moveVendorRequestToFollowUp);

scheduleJob("0 0 1 * *", sendVendorRequestsStatusChangesNDaysNoChangeReminder);
