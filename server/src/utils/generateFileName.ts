import path from 'path';
import dayjs from 'dayjs';

export default function generateFileName(lastName: string, originalname: string): string {
  const localLastName = lastName.replace(/\s+/g, '_');
  const randomString = Math.random().toString(36).substring(2, 6);
  const shortDate = dayjs().format('YYMMDD');
  const extension = path.extname(originalname);
  const newFileName = `${shortDate}${localLastName}${randomString}${extension}`;
  return newFileName;
}
