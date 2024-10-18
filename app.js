// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const tesseract = require('tesseract.js');
const Report = require('./models/reportModel');
const analyzeReport = require('./utils/analyzeText');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Setting up file storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp to avoid conflicts
    }
});

const upload = multer({ storage: storage });

// Connect to MongoDB (replace `<your_mongo_uri>` with your MongoDB connection string)
mongoose.connect('mongodb+srv://vanshkoli22:RC8b5IlQdStkm9ea@cluster0.4mks2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!')).catch(err => console.log(err));

// Basic route for testing API
app.get('/', (req, res) => {
    res.send('Medical Report Analysis API is running!');
});

// Route to upload an image, extract text using Tesseract.js, and analyze the text
app.post('/upload-report', upload.single('report'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;

    // Extract text using Tesseract.js
    tesseract.recognize(filePath, 'eng', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
            // Analyze the extracted text
            const analysis = analyzeReport(text);

            // Save the extracted text and analysis in MongoDB
            const newReport = new Report({
                filePath: filePath,
                extractedText: text,
                analysis: analysis
            });

            newReport.save()
                .then(savedReport => {
                    res.json({
                        message: 'File uploaded, text extracted, and analysis completed successfully!',
                        reportId: savedReport._id,
                        extractedText: savedReport.extractedText,
                        analysis: savedReport.analysis
                    });
                })
                .catch(err => res.status(500).json({ error: 'Failed to save report', err }));
        })
        .catch(err => res.status(500).json({ error: 'Failed to extract text', err }));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

