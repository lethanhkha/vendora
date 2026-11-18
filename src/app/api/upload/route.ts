import { NextRequest, NextResponse } from "next/server";
import { uploadMediaFile } from "@/shared/storage/upload-service";

export async function POST(request: NextRequest) {
  try {
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
