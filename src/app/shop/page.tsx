import ShopPageClient from './shopPageClient';
import { getProducts } from '../../../lib/cms-images';

// Matches CMS_REVALIDATE — product photos and stock come from WordPress.
export const revalidate = 300;

export default async function ShopPage() {
  return <ShopPageClient products={await getProducts()} />;
}
