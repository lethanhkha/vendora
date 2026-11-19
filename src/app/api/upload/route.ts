import { NextRequest, NextResponse } from "next/server";
import { uploadMediaFile } from "@/shared/storage/upload-service";
import { rateLimiter, getClientIp } from "@/shared/security/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting: 15 uploads per minute per IP
    const ip = getClientIp(request.headers);
    const limitCheck = rateLimiter.check(`upload:${ip}`, 15, 60000);

    if (!limitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn đã gửi quá nhiều yêu cầu tải lên (tối đa 15 tệp/phút). Vui lòng thử lại sau.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(limitCheck.resetMs / 1000).toString(),
          },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn tệp hình ảnh để tải lên" },
        { status: 400 }
      );
    }

    const result = await uploadMediaFile(file);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("[API Upload Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi tải lên tệp" },
      { status: 500 }
    );
  }
}
