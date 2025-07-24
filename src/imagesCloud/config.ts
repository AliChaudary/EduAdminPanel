// /api/getSignedUrl.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: any, res: any) {
  const { publicId } = req.query;

  try {
    const url = cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    });

    res.status(200).json({ url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
