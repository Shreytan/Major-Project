import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { CryptoUtils } from '@/utils/crypto.utils';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + CryptoUtils.generateRandomString(8);
    const extension = path.extname(file.originalname);
    cb(null, `dataset-${uniqueSuffix}${extension}`);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  // Allowed file types
  const allowedTypes = [
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/pdf',
    'application/zip',
    'application/sql',
    'application/xml',
    'text/xml'
  ];

  const allowedExtensions = ['.csv', '.json', '.xlsx', '.pdf', '.zip', '.sql', '.xml'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, JSON, XLSX, PDF, ZIP, SQL, and XML files are allowed.'), false);
  }
};

// Configure multer
export const uploadDataset = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1 // Only one file per upload
  }
}).single('datasetFile'); // Field name expected from frontend

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 100MB.',
        errors: ['FILE_TOO_LARGE']
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed.',
        errors: ['TOO_MANY_FILES']
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "datasetFile" as the field name.',
        errors: ['INVALID_FIELD_NAME']
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: ['INVALID_FILE_TYPE']
    });
  }

  next(error);
};

export default uploadDataset;
