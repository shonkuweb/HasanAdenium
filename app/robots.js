export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://mitalinursury.com/sitemap.xml',
    host: 'https://mitalinursury.com',
  };
}
