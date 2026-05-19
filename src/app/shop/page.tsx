import ShopPageClient from './shopPageClient';
import { PRODUCTS } from '../../../lib/products-data';

export default function ShopPage() {
  return <ShopPageClient products={PRODUCTS} />;
}
