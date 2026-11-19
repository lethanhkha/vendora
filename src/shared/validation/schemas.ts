import { z } from "zod";

export const phoneVietNamRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

export const checkoutItemSchema = z.object({
  skuId: z.string().uuid("skuId không hợp lệ"),
  productId: z.string().uuid("productId không hợp lệ"),
  productTitle: z.string().min(1, "Tên sản phẩm không được rỗng"),
  productSlug: z.string().min(1),
  vendorId: z.string().uuid("vendorId không hợp lệ"),
  vendorName: z.string().min(1),
  vendorSlug: z.string().min(1),
  price: z.union([z.string(), z.number()]),
  quantity: z.number().int().min(1, "Số lượng phải từ 1 trở lên"),
  imageUrl: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
});

export const checkoutSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, "Họ và tên người nhận phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên người nhận không được vượt quá 100 ký tự")
    .transform((val) => val.replace(/[<>]/g, "")),
  recipientPhone: z
    .string()
    .trim()
    .regex(phoneVietNamRegex, "Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0987654321 hoặc +84987654321)"),
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Địa chỉ giao hàng phải có ít nhất 5 ký tự")
    .max(255, "Địa chỉ giao hàng quá dài")
    .transform((val) => val.replace(/[<>]/g, "")),
  paymentMethod: z.enum(["COD", "SANDBOX", "VIETQR"], {
    errorMap: () => ({ message: "Phương thức thanh toán không hợp lệ" }),
  }),
  buyerEmail: z.string().email("Email không hợp lệ").optional(),
  items: z.array(checkoutItemSchema).min(1, "Giỏ hàng không được rỗng"),
  voucherDiscount: z.number().nonnegative().optional().default(0),
});

export type CheckoutInputDto = z.infer<typeof checkoutSchema>;

export const createProductSchema = z.object({
  vendorId: z.string().uuid().optional(),
  categoryId: z.string().uuid("Vui lòng chọn danh mục hợp lệ"),
  title: z
    .string()
    .trim()
    .min(3, "Tên tác phẩm phải có ít nhất 3 ký tự")
    .max(200, "Tên tác phẩm không được vượt quá 200 ký tự")
    .transform((val) => val.replace(/[<>]/g, "")),
  slug: z
    .string()
    .trim()
    .min(3, "Slug phải có ít nhất 3 ký tự")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ được chứa ký tự thường, số và dấu gạch ngang"),
  description: z.string().max(5000).optional(),
  imageUrl: z.string().optional(),
  specs: z.record(z.string(), z.any()).optional(),
  price: z.string().optional(),
  skuCode: z.string().optional(),
  initialStock: z.number().int().nonnegative().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  skus: z
    .array(
      z.object({
        skuCode: z.string().min(1),
        price: z.string().min(1),
        attributes: z.record(z.string(), z.any()).optional(),
        stock: z.number().int().nonnegative(),
      })
    )
    .optional(),
});

export const disputeSchema = z.object({
  masterOrderId: z.string().uuid(),
  vendorOrderId: z.string().uuid(),
  buyerEmail: z.string().email().optional(),
  issueType: z.string().min(3).max(100),
  description: z
    .string()
    .trim()
    .min(10, "Mô tả sự cố phải có ít nhất 10 ký tự")
    .max(2000, "Mô tả sự cố không được vượt quá 2000 ký tự")
    .transform((val) => val.replace(/[<>]/g, "")),
  desiredResolution: z.string().min(3).max(100),
  photos: z.array(z.string()).optional(),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  vendorOrderId: z.string().uuid().optional(),
  buyerEmail: z.string().email().optional(),
  rating: z.number().int().min(1).max(5, "Đánh giá sao từ 1 đến 5"),
  craftRating: z.number().int().min(1).max(5).optional(),
  reviewText: z
    .string()
    .trim()
    .min(5, "Nội dung đánh giá phải có ít nhất 5 ký tự")
    .max(2000, "Nội dung đánh giá không được quá 2000 ký tự")
    .transform((val) => val.replace(/[<>]/g, "")),
  images: z.array(z.string()).optional(),
  isAnonymous: z.boolean().optional(),
});
