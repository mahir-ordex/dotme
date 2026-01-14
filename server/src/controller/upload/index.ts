import express from 'express';
import multer from 'multer';
import { uploadCloude } from '../../utils/UploadCloudenarry';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/image', upload.array('file'), async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log("req.files : ", req.files);
    const files = Array.isArray(req.files) ? req.files : [];
    let result = null;
    for (let file of files) {
      result = await uploadCloude(file.path);
      console.log("Upload result : ", result);
      if (!result || !('secure_url' in result)) {
        return res.status(500).json({ error: 'Upload failed' });
      }
    }
    if (result && 'secure_url' in result) {
      res.json({ url: result.secure_url });
    } else {
      res.status(500).json({ error: 'Upload failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
