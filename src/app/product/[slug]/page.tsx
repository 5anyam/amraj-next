// app/products/[slug]/page.tsx (Server Component)
import type { Metadata, ResolvingMetadata } from 'next'
import ProductClient from './product-client'
import { fetchProducts } from '../../../../lib/woocommerceApi'

type Props = { params: { slug: string } }

type ProductWire = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images?: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

type ProductNormalized = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

function normalizeProduct(p: ProductWire): ProductNormalized {
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
  }
}

async function getAllProducts() {
  const products = await fetchProducts() as ProductWire[]
  return products.map(normalizeProduct)
}

async function getProductBySlug(slug: string) {
  const products = await getAllProducts()
  return products.find(p => p.slug === slug || String(p.id) === slug)
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product not found | Amraj',
      description: 'The product you are looking for is unavailable.',
      robots: { index: false, follow: false },
    }
  }

  const slugLower = String(product.slug || '').toLowerCase()

  const baseKeywords = [
    product.name,
    'buy online',
    'price',
    'reviews',
    'India',
  ]

  let intentKeywords: string[] = []
  let catchyBenefit = 'Premium Nutrition'
  let description =
    'High-quality nutrition supplement formulated for real results, rigorous quality, and everyday wellness support.'

  if (slugLower.includes('prostate')) {
    intentKeywords = [
      'prostate care capsules',
      'prostate health supplement',
      'urinary support',
      'enlarged prostate support',
      'mens health',
    ]
    catchyBenefit = 'Prostate Relief & Urinary Support'
    description =
      'Targeted prostate care capsules supporting urinary flow, reduced night-time urgency, and healthy prostate function. Non-GMO, quality assured.'
  } else if (slugLower.includes('weight') || slugLower.includes('fat') || slugLower.includes('slim')) {
    intentKeywords = [
      'weight management capsules',
      'fat burner supplement',
      'metabolism support',
      'appetite control',
      'green coffee extract',
    ]
    catchyBenefit = 'Faster Metabolism & Fat Loss'
    description =
      'Advanced weight management formula to support fat metabolism, curb cravings, and maintain steady energy. Non-GMO, trusted quality.'
  } else if (slugLower.includes('liver') || slugLower.includes('detox')) {
    intentKeywords = [
      'liver detox capsules',
      'liver cleanse supplement',
      'milk thistle alternative',
      'liver support',
      'detox and cleanse',
    ]
    catchyBenefit = 'Liver Cleanse & Support'
    description =
      'Comprehensive liver detox capsules formulated to support natural detoxification, healthy enzymes, and digestive comfort. Non-GMO, quality assured.'
  }

  const keywords = Array.from(new Set([...baseKeywords, ...intentKeywords]))

  const brand = 'Amraj'
  const title = `${product.name} – ${catchyBenefit} | ${brand}`

  const canonical = new URL(`/products/${product.slug}`, 'https://www.amraj.in')
  const imageUrl =
    product.images?.[0]?.src
      ? new URL(product.images[0].src, 'https://www.amraj.in').toString()
      : 'https://www.amraj.in/amraj-logo.jpg'

  const previous = await parent
  const previousOgImages = previous.openGraph?.images ?? []

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonical.toString() },
    openGraph: {
      type: 'website',  // ← Fixed: Changed from 'product' to 'website'
      title,
      description,
      url: canonical.toString(),
      siteName: brand,
      images: [
        ...(Array.isArray(previousOgImages) ? previousOgImages : []),
        { url: imageUrl, width: 1200, height: 630, alt: product.name },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.amraj.in'),
  }
}

export default async function Page({ params }: Props) {
  const product = await getProductBySlug(params.slug)
  const products = await getAllProducts()
  return (
    <ProductClient
      initialProduct={product}
      allProductsInitial={products}
      slug={params.slug}
    />
  )
}
