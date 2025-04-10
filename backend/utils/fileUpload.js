const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create separate directories for different file types
const createSubDir = (dirName) => {
  const dir = path.join(uploadDir, dirName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Create subdirectories
createSubDir('images');
createSubDir('attachments');
createSubDir('profiles');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine file type and send to appropriate directory
    let dest = uploadDir;
    
    if (file.mimetype.startsWith('image/')) {
      dest = path.join(uploadDir, 'images');
    } else if (req.path.includes('profile')) {
      dest = path.join(uploadDir, 'profiles');
    } else {
      dest = path.join(uploadDir, 'attachments');
    }
    
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Accept images and common document types
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
};

// Setup multer for different upload types
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

module.exports = {
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  uploadFields: (fields) => upload.fields(fields)
}; 