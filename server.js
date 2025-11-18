import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Path to your data files
const CRTS_FILE = path.join(__dirname, 'src', 'data', 'crts.json');
const MANUFACTURERS_FILE = path.join(__dirname, 'src', 'data', 'manufacturers.json');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'crts');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET all CRTs
app.get('/api/crts', async (req, res) => {
  try {
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading CRTs:', error);
    res.status(500).json({ error: 'Failed to read CRTs' });
  }
});

// POST new CRT
app.post('/api/crts', async (req, res) => {
  try {
    const newCrt = req.body;
    
    // Read existing data
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    const crts = JSON.parse(data);
    
    // Add new CRT
    crts.push(newCrt);
    
    // Write back to file
    await fs.writeFile(CRTS_FILE, JSON.stringify(crts, null, 2), 'utf8');
    
    res.json({ success: true, crt: newCrt });
  } catch (error) {
    console.error('Error adding CRT:', error);
    res.status(500).json({ error: 'Failed to add CRT' });
  }
});

// PUT update CRT
app.put('/api/crts/:id', async (req, res) => {
  try {
    const crtId = parseInt(req.params.id);
    const updatedCrt = req.body;
    
    // Read existing data
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    let crts = JSON.parse(data);
    
    // Find and update CRT
    const index = crts.findIndex(c => c.id === crtId);
    if (index === -1) {
      return res.status(404).json({ error: 'CRT not found' });
    }
    
    crts[index] = updatedCrt;
    
    // Write back to file
    await fs.writeFile(CRTS_FILE, JSON.stringify(crts, null, 2), 'utf8');
    
    res.json({ success: true, crt: updatedCrt });
  } catch (error) {
    console.error('Error updating CRT:', error);
    res.status(500).json({ error: 'Failed to update CRT' });
  }
});

// DELETE CRT
app.delete('/api/crts/:id', async (req, res) => {
  try {
    const crtId = parseInt(req.params.id);
    
    // Read existing data
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    let crts = JSON.parse(data);
    
    // Filter out the CRT
    crts = crts.filter(c => c.id !== crtId);
    
    // Write back to file
    await fs.writeFile(CRTS_FILE, JSON.stringify(crts, null, 2), 'utf8');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting CRT:', error);
    res.status(500).json({ error: 'Failed to delete CRT' });
  }
});

// Upload images for a CRT
app.post('/api/crts/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const crtId = parseInt(req.params.id);
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Read existing data
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    let crts = JSON.parse(data);
    
    // Find CRT
    const index = crts.findIndex(c => c.id === crtId);
    if (index === -1) {
      return res.status(404).json({ error: 'CRT not found' });
    }
    
    // Add image paths to CRT
    const imagePaths = files.map(file => `/uploads/crts/${file.filename}`);
    
    if (!crts[index].images) {
      crts[index].images = [];
    }
    
    crts[index].images.push(...imagePaths);
    
    // Write back to file
    await fs.writeFile(CRTS_FILE, JSON.stringify(crts, null, 2), 'utf8');
    
    res.json({ success: true, images: imagePaths });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete an image from a CRT
app.delete('/api/crts/:id/images', async (req, res) => {
  try {
    const crtId = parseInt(req.params.id);
    const { imagePath } = req.body;
    
    // Read existing data
    const data = await fs.readFile(CRTS_FILE, 'utf8');
    let crts = JSON.parse(data);
    
    // Find CRT
    const index = crts.findIndex(c => c.id === crtId);
    if (index === -1) {
      return res.status(404).json({ error: 'CRT not found' });
    }
    
    // Remove image from array
    if (crts[index].images) {
      crts[index].images = crts[index].images.filter(img => img !== imagePath);
    }
    
    // Delete physical file
    const filePath = path.join(__dirname, 'public', imagePath);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    
    // Write back to file
    await fs.writeFile(CRTS_FILE, JSON.stringify(crts, null, 2), 'utf8');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});