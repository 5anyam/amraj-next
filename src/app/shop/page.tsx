import ShopPageClient from './shopPageClient';
import { getProducts } from '../../../lib/cms-images';

// Matches CMS_IMAGES_REVALIDATE — product photos come from WordPress.
export const revalidate = 3600;

export default async function ShopPage() {
  return <ShopPageClient products={await getProducts()} />;
}
