const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const db = require("./db");

const router = express.Router();

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload Images API
router.post("/upload", upload.array("images"), (req, res) => {
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  // Save image paths to MySQL
  imagePaths.forEach((image) => {
    db.query("INSERT INTO images (image_path) VALUES (?)", [image], (err) => {
      if (err) console.error("Database Error:", err);
    });
  });

  res.json({ images: imagePaths });
});

// Convert Images to PDF API
router.post("/convert-to-pdf", async (req, res) => {
  try {
    const { images } = req.body;
    const pdfDoc = await PDFDocument.create();

    for (const imgPath of images) {
      const imgBytes = fs.readFileSync(`.${imgPath}`);
      const image = imgPath.endsWith(".png")
        ? await pdfDoc.embedPng(imgBytes)
        : await pdfDoc.embedJpg(imgBytes);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfPath = `./uploads/output-${Date.now()}.pdf`;
    fs.writeFileSync(pdfPath, pdfBytes);

    // Store PDF path in MySQL
    db.query("INSERT INTO pdfs (pdf_path) VALUES (?)", [pdfPath.replace("./uploads", "/uploads")]);

    res.json({ pdfUrl: pdfPath.replace("./uploads", "/uploads") });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
