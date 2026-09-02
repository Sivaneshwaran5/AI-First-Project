const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `audio-${uniqueSuffix}${ext}`);
  },
});

// File filter for audio files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.aac', '.flac', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (
    file.mimetype.startsWith('audio/') ||
    file.mimetype === 'video/webm' ||
    file.mimetype === 'video/mp4' ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type (${file.mimetype}). Please upload an audio file (MP3, WAV, M4A, WEBM).`), false);
  }
};

const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10);

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024,
  },
});

module.exports = upload;
