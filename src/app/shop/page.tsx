
import ProductCard from "../../../components/ProductCard";
import { fetchProducts } from "../../../lib/woocommerceApi";

export const dynamic = "force-dynamic"; 
// Agar har baar fresh data chahiye ho. Nahi chahiye to hata do.

export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
}

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    const result = await fetchProducts();
    products = result as Product[];
  } catch {
    products = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#11131f] transition-colors">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Shop All Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
          Discover our best-selling products for a healthier you.
        </p>

        {products.length === 0 && (
          <div className="text-center text-red-600 dark:text-red-400 mt-12">
            No products available right now.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-[#1c1e2f] rounded-xl p-3 shadow hover:shadow-lg hover:scale-105 transform transition-all"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
