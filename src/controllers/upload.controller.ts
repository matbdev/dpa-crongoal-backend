import { Request, Response, NextFunction } from 'express';
import { uploadFile } from '../services/file.service';
import { AppError } from '../utils/AppError';

export async function uploadRewardIcon(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError('No file provided', 400);
    }

    const bucketName = 'crongoal-bucket';

    const uploadedData = await uploadFile(
      req.file.buffer,
      bucketName,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json({
      message: 'Ícone da recompensa enviado com sucesso!',
      url: uploadedData.publicUrl
    });
  } catch (error) {
    next(error);
  }
}
