import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1', endpoint: process.env.S3_ENDPOINT });
const bucket = process.env.S3_BUCKET || 'adcraft';

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const fileStream = fs.createReadStream(req.file.path);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: req.file.filename, Body: fileStream }));
  fs.unlinkSync(req.file.path);
  res.json({ key: req.file.filename });
});

app.get('/download/:key', async (req, res) => {
  try {
    const data = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: req.params.key }));
    (data.Body as any).pipe(res);
  } catch {
    res.status(404).end();
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Asset service running on ${port}`));

export default app;
