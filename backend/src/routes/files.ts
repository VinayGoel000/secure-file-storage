import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { authenticate } from '../middleware/auth';
import { uploadFile } from '../controllers/fileController';
import { MAX_FILE_SIZE } from '../validators/file';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../tmp/uploads'));
  },
  filename: (_req, _file, cb) => {
    cb(null, `${uuidv4()}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadFile);

export default router;
