
import { fetchProducts } from "../../../lib/woocommerceApi";
import ShopPageClient from "./shopPageClient";

export const dynamic = "force-dynamic";

export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
  categories?: { name: string }[];
  tags?: { name: string }[];
}

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    const result = await fetchProducts();
    products = result as Product[];
  } catch {
    products = [];
  }

  return <ShopPageClient products={products} />;
}