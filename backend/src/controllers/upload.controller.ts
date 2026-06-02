import { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// ─── Multer Config: Memory Storage, 5MB Limit, Type Filter ────────────────────
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'));
    }
  },
});

// ─── Upload Handler ──────────────────────────────────────────────────────────
export const handleImageUpload = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new ApiError(400, 'No image file provided in upload request.');
    }

    // Determine target Cloudinary folder from query params (defaults to general)
    const context = req.query.folder as string;
    let targetFolder = 'agesense/general';

    if (context === 'programs') {
      targetFolder = 'agesense/programs';
    } else if (context === 'impact-stories') {
      targetFolder = 'agesense/impact-stories';
    } else if (context === 'gallery') {
      targetFolder = 'agesense/gallery';
    } else if (context === 'partners') {
      targetFolder = 'agesense/partners';
    }

    // Wrap Cloudinary upload_stream in a Promise
    const uploadStream = (fileBuffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: targetFolder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        (stream as any).end(fileBuffer);
      });
    };

    try {
      const uploadResult = await uploadStream(req.file.buffer);
      
      res.status(200).json({
        success: true,
        imageUrl: uploadResult.secure_url,
      });
    } catch (err: any) {
      throw new ApiError(500, `Cloudinary stream upload failed: ${err.message}`);
    }
  }
);
