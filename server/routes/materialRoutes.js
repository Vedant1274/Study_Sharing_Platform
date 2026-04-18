const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadMaterial, getMaterials, downloadMaterial, deleteMaterial } = require('../controllers/materialController');

// Multer config for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Make filename unique
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

// Configure Multer with 10MB file size limit
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx|ppt|pptx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF, DOC, and PPT are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter,
});

// Routes
router.post('/upload', upload.single('file'), uploadMaterial);
router.get('/', getMaterials);
router.get('/search', getMaterials); // Same controller handles search query
router.get('/download/:id', downloadMaterial);
router.delete('/:id', deleteMaterial);

module.exports = router;
