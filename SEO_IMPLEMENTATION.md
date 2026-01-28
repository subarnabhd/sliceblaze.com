# SEO Implementation Guide

## Overview
Comprehensive SEO implementation has been added to your Sliceblaze application. This includes meta tags, OpenGraph, Twitter Cards, structured data (JSON-LD), sitemap, and robots.txt.

## What Has Been Added

### 1. Root Layout Metadata (`app/layout.tsx`)
- **Title Template**: Dynamic titles with "| Sliceblaze" suffix
- **Meta Description**: Comprehensive business description
- **Keywords**: Relevant SEO keywords
- **OpenGraph Tags**: For social media sharing (Facebook, LinkedIn)
- **Twitter Cards**: For Twitter sharing with large images
- **Robots Meta**: Configured for optimal indexing
- **Site Verification**: Placeholders for Google and Yandex verification

### 2. Dynamic Business Profile Metadata (`app/(user)/[username]/layout.tsx`)
Each business profile page now has:
- **Dynamic Title**: `{Business Name} - {Category} | Sliceblaze`
- **Custom Description**: Uses business description or generates from business info
- **Business-specific Keywords**: Includes business name, category, location
- **OpenGraph Images**: Business logo/image for social sharing
- **Canonical URLs**: Prevents duplicate content issues
- **JSON-LD Structured Data**: Google-friendly business information

### 3. Page-Specific Metadata
All pages now have optimized metadata:

#### Public Pages (Indexed)
- **Home** (`/`): Main landing page with primary keywords
- **Features** (`/features`): Feature descriptions and benefits
- **Contact** (`/contact`): Contact information
- **Search** (`/search`): Business search and discovery
- **Business Profiles** (`/[username]`): Individual business pages

#### Protected Pages (Not Indexed)
- **Login** (`/login`): robots: noindex, nofollow
- **Register** (`/register`): robots: noindex, nofollow
- **Dashboard** (`/dashboard`): robots: noindex, nofollow
- **Admin Pages** (`/admin/*`): robots: noindex, nofollow

### 4. Sitemap (`app/sitemap.ts`)
Auto-generates XML sitemap with:
- All static pages
- All active business profiles
- Update frequencies
- Priority levels
- Last modified dates

### 5. Robots.txt (`app/robots.ts`)
Configured to:
- Allow crawling of public pages
- Block admin, dashboard, and API routes
- Reference sitemap location

### 6. JSON-LD Structured Data (`lib/json-ld.tsx`)
Three types of structured data:
- **Organization**: Company-level information
- **LocalBusiness**: Individual business profiles
- **Website**: Site-wide search functionality

## Important Notes

### Update Site Verification Codes
In `app/layout.tsx`, replace placeholder verification codes:

```typescript
verification: {
  google: 'your-google-verification-code',  // Replace this
  yandex: 'your-yandex-verification-code',  // Replace this
},
```

To get verification codes:
1. **Google Search Console**: https://search.google.com/search-console
2. **Yandex Webmaster**: https://webmaster.yandex.com

### Create OG Image
Create an Open Graph image for social sharing:
- **Path**: `/public/og-image.jpg`
- **Dimensions**: 1200 x 630 pixels
- **Format**: JPG or PNG
- **Content**: Your logo + tagline

### Update Site URL
If your domain is different from `sliceblaze.com`, update:
- `app/layout.tsx`: `metadataBase`
- `app/sitemap.ts`: `baseUrl`
- `app/robots.ts`: sitemap URL
- `lib/json-ld.tsx`: all URL references

### Test Your SEO

#### 1. Local Testing
```bash
npm run build
npm start
```

#### 2. Check Sitemap
Visit: `http://localhost:3000/sitemap.xml`

#### 3. Check Robots
Visit: `http://localhost:3000/robots.txt`

#### 4. Validate Metadata
Use browser DevTools to inspect `<head>` section

#### 5. Test Social Sharing
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

#### 6. Structured Data Testing
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/

### SEO Best Practices

#### Content Optimization
1. Use unique, descriptive titles (50-60 characters)
2. Write compelling meta descriptions (150-160 characters)
3. Include primary keywords naturally
4. Use header tags (H1, H2, H3) hierarchically
5. Add alt text to all images

#### Technical SEO
1. Ensure fast page load times
2. Mobile-responsive design (already implemented)
3. Use HTTPS (configure in production)
4. Submit sitemap to Google Search Console
5. Monitor Core Web Vitals

#### Business Profile SEO
Each business profile is optimized with:
- Unique page titles with business name
- Business-specific meta descriptions
- Structured data for local business
- Social media integration
- Location information
- Contact details

### Monitoring & Analytics

#### Recommended Tools
1. **Google Search Console**: Monitor search performance
2. **Google Analytics 4**: Track user behavior
3. **Bing Webmaster Tools**: Additional search engine coverage
4. **Ahrefs/SEMrush**: Advanced SEO analysis

#### Key Metrics to Track
- Organic search traffic
- Keyword rankings
- Click-through rates (CTR)
- Bounce rates
- Page load speed
- Mobile usability

### Next Steps

1. **Add Google Analytics**
   - Create GA4 property
   - Add tracking code to layout

2. **Submit to Search Engines**
   - Google Search Console
   - Bing Webmaster Tools
   - Yandex Webmaster

3. **Create Content**
   - Blog posts (if applicable)
   - Business guides
   - Location pages

4. **Build Backlinks**
   - Business directories
   - Local citations
   - Industry partnerships

5. **Regular Updates**
   - Keep business information current
   - Update sitemaps automatically
   - Monitor and fix broken links

## File Structure

```
app/
├── layout.tsx                    # Root metadata + Organization JSON-LD
├── sitemap.ts                    # Auto-generated sitemap
├── robots.ts                     # Robots.txt configuration
├── page.tsx                      # Homepage metadata
├── (user)/
│   ├── [username]/
│   │   ├── layout.tsx           # Business metadata generator
│   │   └── page.tsx             # Business profile + JSON-LD
│   ├── features/page.tsx        # Features metadata
│   ├── contact/page.tsx         # Contact metadata
│   ├── search/page.tsx          # Search metadata
│   ├── login/page.tsx           # Login metadata (noindex)
│   ├── register/page.tsx        # Register metadata (noindex)
│   └── dashboard/page.tsx       # Dashboard metadata (noindex)
└── admin/
    └── layout.tsx               # Admin metadata (noindex)

lib/
└── json-ld.tsx                  # JSON-LD generators
```

## Troubleshooting

### Metadata Not Showing
- Clear browser cache
- Check React DevTools
- Rebuild the application
- Verify no duplicate metadata exports

### Sitemap Not Generating
- Check Supabase connection
- Verify businesses table has data
- Check console for errors

### Social Cards Not Working
- Verify OG image exists and is accessible
- Use Facebook/Twitter debuggers
- Check absolute URLs (not relative)

## Support

For issues or questions:
1. Check Next.js metadata documentation
2. Review error messages in console
3. Test in production environment
4. Validate with SEO testing tools

## Changelog

### Version 1.0.0 (Current)
- ✅ Root layout metadata with OpenGraph & Twitter Cards
- ✅ Dynamic business profile metadata
- ✅ All page-specific metadata
- ✅ JSON-LD structured data
- ✅ Sitemap generation
- ✅ Robots.txt configuration
- ✅ SEO-friendly URLs
- ✅ Canonical URLs
- ✅ Social media integration

---

**Remember**: SEO is an ongoing process. Regularly monitor, update, and optimize your content for best results.
