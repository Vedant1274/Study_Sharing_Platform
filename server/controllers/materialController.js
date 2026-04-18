const Material = require('../models/Material');
const path = require('path');
const fs = require('fs');

// @desc    Upload new study material
// @route   POST /api/materials/upload
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, subject } = req.body;

    if (!title || !subject) {
      // Remove the uploaded file if metadata is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title and subject are required' });
    }

    const newMaterial = new Material({
      title,
      subject,
      filePath: req.file.path,
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json(savedMaterial);
  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path); // Cleanup on error
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all materials or search by title
// @route   GET /api/materials or /api/materials/search?q=
exports.getMaterials = async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      // Case-insensitive regex search on title
      query.title = { $regex: q, $options: 'i' };
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Download material file and increment counter
// @route   GET /api/materials/download/:id
exports.downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const filePath = path.resolve(material.filePath);

    // Check if file exists in filesystem
    if (!fs.existsSync(filePath)) {
       return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    material.downloadCount += 1;
    await material.save();

    // Trigger download
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error during download:', err);
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    console.log(`DELETE request received for ID: ${req.params.id}`);
    const material = await Material.findById(req.params.id);

    if (!material) {
      console.log('Material not found in database');
      return res.status(404).json({ message: 'Material not found' });
    }

    const filePath = path.resolve(material.filePath);
    console.log(`Attempting to delete file at path: ${filePath}`);

    // Delete file from filesystem if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File successfully deleted from filesystem');
    } else {
      console.log('File not found on filesystem, skipping file deletion');
    }

    await Material.findByIdAndDelete(req.params.id);
    console.log('Material document successfully deleted from MongoDB');

    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMaterial:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
