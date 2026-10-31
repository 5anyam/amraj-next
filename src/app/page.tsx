import Homepage from './home-client';
import { getProducts } from '../../lib/cms-images';

// Matches CMS_IMAGES_REVALIDATE — product photos come from WordPress.
export const revalidate = 3600;

export default async function Page() {
  return <Homepage products={await getProducts()} />;
}
