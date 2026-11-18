import fs from "fs";
import path from "path";
import { createAdminClient } from "@/shared/supabase/admin";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Xử lý tải ảnh lên Supabase Storage hoặc lưu trữ cục bộ vào thư mục public/uploads
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

    // 3. Try Supabase Storage if configured and available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder")) {
      try {
        const adminClient = createAdminClient();
        const { data, error } = await adminClient.storage
          .from("products")
          .upload(`uploads/${cleanFileName}`, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = adminClient.storage
            .from("products")
            .getPublicUrl(`uploads/${cleanFileName}`);

          return {
            success: true,
            url: publicUrlData.publicUrl,
          };
        }
      } catch (storageErr) {
        console.warn("[uploadMediaFile] Supabase storage upload bypassed, falling back to local disk storage:", storageErr);
      }
    }

    // 4. Fallback: Save to public/uploads directory on local disk
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;
    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error("[uploadMediaFile Error]:", error);
    return {
      success: false,
      error: error.message || "Tải lên tệp thất bại.",
    };
  }
}
