const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");
const asyncHandler = require("../utils/async");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const { NotFoundError, ErrorResponse } = require("../utils/errors");

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const filename =
      req.user.id.toString() + "__" + Date.now() + "__" + file.originalname;
    const fileInfo = {
      filename: filename,
      bucketName: "uploads",
    };
    return fileInfo;
  },
});

const gridFs = { gfs: null, gridfsBucket: null };
const conn = mongoose.connection;
conn.once("open", function () {
  gridFs.gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gridFs.gfs = Grid(conn.db, mongoose.mongo);
  gridFs.gfs.collection("uploads");
});

exports.uploader = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ![".jpg", ".jpeg", ".png", ".pdf", ".xlsx", ".xls", ".csv"].includes(ext)
    ) {
      return callback(null, true);
      // return callback(
      //   new ErrorResponse("Only images,pdf, or excels are allowed", 400)
      // );
    }
    callback(null, true);
  },
});
exports.gridFs = gridFs;

exports.uploadFile = asyncHandler((req, res, next) => {
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = req.file.filename;
  return res.json({ filename: imgUrl });
});

exports.getFileByFilename = asyncHandler(async (req, res, next) => {
  const file = await gridFs.gfs.files.findOne({
    filename: req.params.filename,
  });
  if (!file) {
    return next(new NotFoundError("File"));
  }
  const readStream = gridFs.gridfsBucket.openDownloadStream(file._id);
  res.setHeader("content-type", file.contentType);
  readStream.pipe(res);
});

exports.deleteFileByFilename = asyncHandler(async (req, res, next) => {
  const file = await gridFs.gfs.files.findOne({
    filename: req.params.filename,
  });
  const gsfb = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  if (!file) {
    return next(new NotFoundError("File"));
  }
  gsfb.delete(file._id, function (err, gridStore) {
    if (err) return next(err);
    res.status(200).end();
  });
});
