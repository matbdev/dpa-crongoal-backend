import { Router } from 'express';
import multer from 'multer';
import { uploadRewardIcon } from '../controllers/upload.controller';

const router = Router();
const maxBytesForImage = 256 * 1024;

// Configures multer to store files in memory as Buffer instead of saving to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: maxBytesForImage // 256 KB limit
  }
});

router.post('/reward-icon', upload.single('icon'), uploadRewardIcon as any);

export default router;
