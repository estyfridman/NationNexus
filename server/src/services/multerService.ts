import multer from 'multer';
import path from 'path';
import fs from 'fs';
import generateFileName from '../utils/generateFileName';
import {MESSAGES, FILESIZE, PATH, TEXT} from '../constants';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(req.body.lastName ? req.body.lastName : TEXT.USER, file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith(PATH.IMG)) {
    cb(null, true);
  } else {
    cb(new Error(MESSAGES.IMG_FILE_ERR), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {fileSize: FILESIZE},
  fileFilter: fileFilter,
});

export default upload;
