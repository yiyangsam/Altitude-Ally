import type { CartItem } from './CartContext';
import type { Product } from './DataContext';

export const DELIVERY_PLUS_PRODUCT_NAME = 'Delivery+';
export const DELIVERY_PLUS_CATEGORY = 'Perks';

export const STANDARD_DELIVERY_TIERS = [
  { label: '฿0–1,999', fee: 250 },
  { label: '฿2,000–2,999', fee: 150 },
  { label: '฿3,000–3,999', fee: 100 },
  { label: '฿4,000+', fee: 0 }
] as const;

export const DELIVERY_PLUS_TIERS = [
  { label: '฿0–1,999', fee: 200 },
  { label: '฿2,000–2,999', fee: 100 },
  { label: '฿3,000+', fee: 0 }
] as const;

const normalize = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';

export function isDeliveryPlusProduct(product: Pick<Product, 'name' | 'category'> | null | undefined) {
  return Boolean(product)
    && normalize(product?.name) === DELIVERY_PLUS_PRODUCT_NAME.toLowerCase()
    && normalize(product?.category) === DELIVERY_PLUS_CATEGORY.toLowerCase();
}

export function isDeliveryPlusCartItem(item: Pick<CartItem, 'name' | 'category'> | null | undefined) {
  return Boolean(item)
    && normalize(item?.name) === DELIVERY_PLUS_PRODUCT_NAME.toLowerCase()
    && normalize(item?.category) === DELIVERY_PLUS_CATEGORY.toLowerCase();
}

export function getStandardDeliveryFee(merchandiseSubtotal: number) {
  if (merchandiseSubtotal >= 4000) return 0;
  if (merchandiseSubtotal >= 3000) return 100;
  if (merchandiseSubtotal >= 2000) return 150;
  return 250;
}

export function getDeliveryPlusFee(merchandiseSubtotal: number) {
  if (merchandiseSubtotal >= 3000) return 0;
  if (merchandiseSubtotal >= 2000) return 100;
  return 200;
}

export function formatDeliveryFee(fee: number) {
  return fee === 0 ? 'Free' : `฿${fee.toLocaleString()}`;
}
