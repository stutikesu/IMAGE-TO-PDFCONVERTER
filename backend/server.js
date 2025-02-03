const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const app = express();
const port = 5000;

// ✅ Enable CORS (Fix Frontend Issues)
app.use(cors());
app.use(express.json());

// ✅ Setup Multer for File Uploads
const upload = multer({ dest: 'uploads/' });

// ✅ Test Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/convert-to-pdf', upload.array('images'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.log('❌ No images uploaded');
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const pdfDoc = await PDFDocument.create();

        for (let file of req.files) {
            try {
                const imageBytes = fs.readFileSync(file.path);
                const image = await pdfDoc.embedJpg(imageBytes).catch(() => pdfDoc.embedPng(imageBytes));

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

                fs.unlinkSync(file.path); // ✅ Delete temp file
            } catch (err) {
                console.error('❌ Error processing image:', file.originalname, err);
                return res.status(500).json({ error: 'Error processing image' });
            }
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('❌ Internal Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ✅ Start the Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
