const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const shortId = require("shortid");
const s3 = require("../utils/s3");
const Application = require("../models/Application");

const router = express.Router();

// Multer config
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `cvs/${shortId.generate()}-${file.originalname.replace(/[^a-zA-Z0-9.\\-_]/g, '_')}`;
      cb(null, filename);
    },
  }),
});

// Wrapped route with custom error handling
router.post("/", (req, res, next) => {
  upload.single("attachment")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File upload error", detail: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Server error", detail: err.message });
    }

    // Handle application logic
    try {
      const data = req.body;
      const qualifications = JSON.parse(data.qualifications);
      const cvUrl = req.file.location;

      const application = new Application({
        ...data,
        qualifications,
        cvUrl,
      });

      application.save().then(() => {
        res.status(201).json({ message: "Application saved", cvUrl });
      }).catch((saveErr) => {
        res.status(500).json({ error: "Failed to save to database", detail: saveErr.message });
      });
    } catch (parseErr) {
      res.status(400).json({ error: "Invalid input", detail: parseErr.message });
    }
  });
});

module.exports = router;
