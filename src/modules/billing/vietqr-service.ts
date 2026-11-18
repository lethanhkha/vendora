export interface VietQRConfig {
  bankId: string;       // e.g. "MB", "VCB", "TCB", "ICB"
  accountNo: string;    // e.g. "0987654321"
  accountName: string;  // e.g. "VENDORA ESCROW PLATFORM"
  template?: "compact" | "compact2" | "qr_only" | "print";
}

export const DEFAULT_VIETQR_CONFIG: VietQRConfig = {
  bankId: "MB",
  accountNo: "0987654321",
  accountName: "VENDORA PLATFORM ESCROW",
  template: "compact2",
};

/**
 * Sinh URL mã QR VietQR động chuẩn Napas QuickLink
 */
export function generateVietQRUrl(params: {
  amount: number | string;
  orderNumber: string;
  config?: Partial<VietQRConfig>;
}): string {
  const cfg = { ...DEFAULT_VIETQR_CONFIG, ...params.config };
  const cleanAmount = Math.round(Number(params.amount));
  const addInfo = encodeURIComponent(params.orderNumber.trim());
  const accountName = encodeURIComponent(cfg.accountName);

  return `https://img.vietqr.io/image/${cfg.bankId}-${cfg.accountNo}-${cfg.template || "compact2"}.png?amount=${cleanAmount}&addInfo=${addInfo}&accountName=${accountName}`;
}

/**
 * Tạo dữ liệu chỉ dẫn chuyển khoản chi tiết
 */
export function getVietQRTransferInstructions(params: {
  amount: number | string;
  orderNumber: string;
  config?: Partial<VietQRConfig>;
}) {
  const cfg = { ...DEFAULT_VIETQR_CONFIG, ...params.config };
  const qrUrl = generateVietQRUrl(params);

  return {
    qrUrl,
    bankName: "Ngân hàng Quân Đội (MB Bank)",
    bankCode: cfg.bankId,
    accountNo: cfg.accountNo,
    accountName: cfg.accountName,
    amount: Number(params.amount),
    transferContent: params.orderNumber,
    note: "Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động xác thực đơn hàng qua Webhook.",
  };
}
