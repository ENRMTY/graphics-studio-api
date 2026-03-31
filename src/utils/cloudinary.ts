import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadFolder =
  | "lfc-studio/teams"
  | "lfc-studio/competitions"
  | "lfc-studio/backgrounds";

export interface UploadResult {
  url: string;
  publicId: string;
}

// upload a buffer to cloudinary and return the secure url + public_id
export async function uploadImage(
  buffer: Buffer,
  folder: UploadFolder,
  publicIdOverride?: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      folder,
      resource_type: "image",
      // auto-format + quality for optimal delivery
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    };
    if (publicIdOverride) {
      options.public_id = publicIdOverride;
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("[Cloudinary]: upload failed"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

// delete an image from cloudinary by its public_id
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // log errors without throwing
    console.warn(`[Cloudinary]: Failed to delete ${publicId}`);
  }
}

export default cloudinary;
