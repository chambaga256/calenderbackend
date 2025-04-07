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
      const attachment = req.file.location;

      const application = new Application({
        ...data,
        qualifications,
        attachment,
      });

      application.save().then(() => {
        res.status(201).json({ message: "Application saved", attachment});
      }).catch((saveErr) => {
        res.status(500).json({ error: "Failed to save to database", detail: saveErr.message });
      });
    } catch (parseErr) {
      res.status(400).json({ error: "Invalid input", detail: parseErr.message });
    }
  });
});


const ExcelJS = require("exceljs");

router.get("/applicants", async (req, res) => {
  try {
    const applications = await Application.find().lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "Post", key: "post", width: 50 },
      { header: "Surname", key: "surnameNow", width: 50 },
      { header: "First Name", key: "firstNames", width: 50 },
      { header: "Date of Birth", key: "dob", width: 50 },
      { header: "Age", key: "age", width: 50 },
      { header: "Gender", key: "gender", width: 50 },
      { header: "Religion", key: "religion", width: 50 },
      { header: "Marital Status", key: "maritalStatus", width: 50 },
      { header: "Residential Address", key: "residentialAddress", width: 50 },
      { header: "Town", key: "town", width: 50 },
      { header: "Postal Address", key: "postalAddress", width: 50 },
      { header: "Telephone", key: "telephone", width: 50 },
      { header: "Email", key: "email", width: 50 },
      { header: "Citizenship", key: "citizenship", width: 50 },
      { header: "National ID", key: "idNumber", width: 50 },
      { header: "Home District", key: "homeDistrict", width: 50 },
      { header: "Qualifications", key: "qualifications", width: 80 },
      { header: "Attachment", key: "attachment", width: 50 },
      { header: "Submitted At", key: "submittedAt", width: 25 }
    ];

    applications.forEach(app => {
      const formattedQualifications = Array.isArray(app.qualifications)
        ? app.qualifications.map(q => {
            if (typeof q === 'object' && q !== null) {
              return `${q.level || ''} from ${q.institution || ''} (${q.year || ''})`;
            }
            return String(q);
          }).join("; ")
        : JSON.stringify(app.qualifications);

      worksheet.addRow({
        ...app,
        qualifications: formattedQualifications,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=applications.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to generate Excel file", detail: err.message });
  }
});

module.exports = router;
