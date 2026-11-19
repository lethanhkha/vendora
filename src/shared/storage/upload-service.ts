import fs from "fs";
import path from "path";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Universal Media Upload Service:
 * Saves files to public/uploads or converts to resilient Data URL in serverless environments.
 * Independent of external vendor lock-in.
 */
export async function uploadMediaFile(file: File): Promise<UploadResult> {
  try {
    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Định dạng tệp không được hỗ trợ (${file.type}). Chỉ chấp nhận JPG, PNG, WEBP, GIF.`,
      };
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Dung lượng tệp vượt quá giới hạn 5MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "jpg"}`;
    const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // 3. Save to public/uploads
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, cleanFileName);
      await fs.promises.writeFile(filePath, buffer);

      return {
        success: true,
        url: `/uploads/${cleanFileName}`,
      };
    } catch (diskErr) {
      // In read-only serverless filesystems, fallback to data URL
      console.warn("[uploadMediaFile] Disk write unavailable, returning inline Data URL:", diskErr);
      const base64 = buffer.toString("base64");
      return {
        success: true,
        url: `data:${file.type};base64,${base64}`,
      };
    }
  } catch (error: any) {
    console.error("[uploadMediaFile Error]:", error);
    return {
      success: false,
      error: error.message || "Tải lên tệp thất bại.",
    };
  }
}
