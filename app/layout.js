import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL("https://mitalinursury.com"),
  title: {
    default: "Mitali Nursery - Wholesale & Retail Plant Nursery in Panskura, West Bengal | Buy Live Plants Online",
    template: "%s | Mitali Nursery"
  },
  description: "Mitali Nursery (Malati Nursery) is a leading wholesale and retail plant nursery in Panskura, West Bengal offering 300+ live plant varieties including Adenium, Bonsai, Fruit Plants & Garden Plants. Fast bulk shipping across India.",
  keywords: [
    "mitalinursury.com",
    "mitalinursery.com",
    "Mitali Nursery",
    "Mitali Nursury",
    "Malati Nursery",
    "Malati Nursury",
    "nursery plant",
    "wholesale nursery",
    "wholesale plant supplier",
    "online plant nursery",
    "buy live plants online",
    "wholesale adenium nursery",
    "bulk plants online India",
    "Panskura plant nursery",
    "plant nursery West Bengal",
    "cheap nursery plants",
    "garden plants wholesale",
    "fruit plants nursery Panskura"
  ],
  authors: [{ name: "Mitali Nursery", url: "https://mitalinursury.com" }],
  creator: "Mitali Nursery",
  publisher: "Mitali Nursery",
  alternates: {
    canonical: "https://mitalinursury.com"
  },
  openGraph: {
    title: "Mitali Nursery - #1 Wholesale & Retail Plant Nursery in Panskura",
    description: "Buy live nursery plants online at wholesale and retail prices. 300+ plant varieties including Adenium, Grafted Plants & Fruit Trees with delivery across India.",
    url: "https://mitalinursury.com",
    siteName: "Mitali Nursery",
    images: [
      {
        url: "https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/Malatinursury/MalatiNurseryLogo.png",
        width: 1200,
        height: 630,
        alt: "Mitali Nursery Logo - Live Plant Nursery Panskura"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitali Nursery - Wholesale & Retail Live Plant Nursery",
    description: "Buy 300+ varieties of live nursery plants online at wholesale prices. Fast delivery across India.",
    images: ["https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/Malatinursury/MalatiNurseryLogo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GardenStore",
      "@id": "https://mitalinursury.com/#store",
      "name": "Mitali Nursery",
      "alternateName": ["Mitali Nursury", "Malati Nursery", "Malati Nursury", "Mitali Wholesale Nursery"],
      "url": "https://mitalinursury.com",
      "logo": "https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/Malatinursury/MalatiNurseryLogo.png",
      "image": "https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/Malatinursury/MalatiNurseryLogo.png",
      "description": "Mitali Nursery is a premier wholesale & retail live plant nursery in Panskura, West Bengal providing 300+ plant varieties including Adenium, Bonsai, Fruit Plants, and Garden Plants.",
      "telephone": "+917427941760",
      "priceRange": "₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Panskura",
        "addressLocality": "Panskura",
        "addressRegion": "West Bengal",
        "postalCode": "721152",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 22.386,
        "longitude": 87.701
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "08:00",
        "closes": "20:00"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://mitalinursury.com/#website",
      "url": "https://mitalinursury.com",
      "name": "Mitali Nursery",
      "alternateName": ["mitalinursury.com", "mitalinursery.com", "Mitali Nursury"],
      "description": "Buy wholesale & retail nursery plants online from Mitali Nursery Panskura."
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body>
        <div className="desktop-blocker">
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
          <h2>Please open this website on a mobile phone</h2>
          <p style={{ marginTop: '20px', color: '#666' }}>Crafted by <strong>ShonkuWeb</strong></p>
        </div>
        <div className="mobile-app-container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}

