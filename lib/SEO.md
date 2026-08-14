# SEO Utilities

Search engine optimization utilities for metadata generation and structured data.

## File

- **seo.ts** - SEO utilities for generating meta tags, structured data, sitemaps

## Features

- Meta tag generation (title, description, OG tags)
- Structured data (JSON-LD)
- Sitemap generation
- Open Graph support
- Twitter Card support
- Canonical URL management

## Usage

```typescript
import { generateMetadata, structuredData } from '@/lib/seo'

// Generate metadata for a page
export const metadata = generateMetadata({
  title: 'Blog Post Title',
  description: 'Post description',
  image: 'https://...',
  url: 'https://example.com/post'
})

// Add structured data
const schema = structuredData.article({
  headline: 'Article Title',
  author: 'Author Name',
  datePublished: new Date(),
  image: 'https://...'
})
```

## Next.js Integration

Use in Next.js `generateMetadata`:

```typescript
import { generateMetadata } from '@/lib/seo'

export async function generateMetadata({ params }) {
  const post = await getPost(params.id)
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.image
  })
}
```

## Structured Data Types

- Article (blog posts)
- BreadcrumbList (navigation)
- Organization (company info)
- Product (e-commerce)
- LocalBusiness (location-based)

## Best Practices

- Always include og:image for social sharing
- Use descriptive, unique titles & descriptions
- Implement breadcrumb structured data
- Generate XML sitemaps
- Set canonical URLs to prevent duplicates
