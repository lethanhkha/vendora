import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vendora.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products/", "/store/", "/search"],
        disallow: [
          "/admin/",
          "/vendor/",
          "/api/",
          "/account/",
          "/orders/",
          "/cart/",
          "/login",
          "/signup",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
