export type CartItem = {
  skuId: string;
  productId: string;
  productTitle: string;
  productSlug: string;
  imageUrl?: string;
  price: string; // unit price
  quantity: number;
  attributes?: Record<string, any>;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorLocation?: string;
};

export type VendorCartGroup = {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorLocation: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
};

export type CartSummary = {
  groups: VendorCartGroup[];
  totalItems: number;
  itemsSubtotal: number;
  totalShippingFee: number;
  platformDiscount: number;
  grandTotal: number;
};

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const groupsMap = new Map<string, VendorCartGroup>();

  for (const item of items) {
    let group = groupsMap.get(item.vendorId);
    if (!group) {
      group = {
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        vendorSlug: item.vendorSlug,
        vendorLocation: item.vendorLocation || "Hà Nội",
        items: [],
        subtotal: 0,
        shippingFee: 30000, // Standard vendor delivery fee (30.000 ₫)
        total: 0,
      };
      groupsMap.set(item.vendorId, group);
    }

    const itemTotal = parseFloat(item.price) * item.quantity;
    group.items.push(item);
    group.subtotal += itemTotal;
  }

  const groups = Array.from(groupsMap.values());
  let itemsSubtotal = 0;
  let totalShippingFee = 0;
  let totalItems = 0;

  for (const group of groups) {
    group.total = group.subtotal + group.shippingFee;
    itemsSubtotal += group.subtotal;
    totalShippingFee += group.shippingFee;
    totalItems += group.items.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  // Free shipping promo if itemsSubtotal > 2.000.000 ₫
  const platformDiscount = itemsSubtotal >= 2000000 ? 50000 : 0;
  const grandTotal = Math.max(0, itemsSubtotal + totalShippingFee - platformDiscount);

  return {
    groups,
    totalItems,
    itemsSubtotal,
    totalShippingFee,
    platformDiscount,
    grandTotal,
  };
}
