import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://cms.amraj.in';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product_id');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wc/v3/products/${productId}/reviews?status=approved&per_page=100`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const reviews = await response.json();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, author_name, author_email, review, rating } = body;

    if (!product_id || !author_name || !review || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, author_name, review, rating' },
        { status: 400 }
      );
    }

    // Create review in WordPress
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wc/v3/products/${product_id}/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64')}`,
        },
        body: JSON.stringify({
          product_id: parseInt(product_id),
          review,
          reviewer: author_name,
          reviewer_email: author_email || '',
          rating: parseInt(rating),
          status: 'hold', // Reviews will be pending approval
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('WordPress API Error:', errorData);
      throw new Error('Failed to create review');
    }

    const newReview = await response.json();
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
