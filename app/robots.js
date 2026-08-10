export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://hasanadenium.com/sitemap.xml',
    host: 'https://hasanadenium.com',
  };
}
