import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL("https://hasanadenium.com"),
  title: {
    default: "Hasan Adenium - Wholesale & Retail Plant Nursery | Buy Live Adenium Plants Online",
    template: "%s | Hasan Adenium"
  },
  description: "Hasan Adenium is a leading wholesale and retail plant nursery offering premium live Adenium plants, Bonsai & Garden Plants with fast shipping across India.",
  keywords: [
    "hasanadenium.com",
    "hasanadenium",
    "Hasan Adenium",
    "Hasan Adenium Nursery",
    "nursery plant",
    "wholesale nursery",
    "wholesale plant supplier",
    "online plant nursery",
    "buy live plants online",
    "wholesale adenium nursery",
    "grafted adenium plants",
    "multigrafted adenium",
    "bulk plants online India",
    "Panskura plant nursery",
    "plant nursery West Bengal"
  ],
  authors: [{ name: "Hasan Adenium", url: "https://hasanadenium.com" }],
  creator: "Hasan Adenium",
  publisher: "Hasan Adenium",
  alternates: {
    canonical: "https://hasanadenium.com"
  },
  openGraph: {
    title: "Hasan Adenium - Wholesale & Retail Adenium Nursery",
    description: "Buy live adenium nursery plants online at wholesale and retail prices with delivery across India.",
    url: "https://hasanadenium.com",
    siteName: "Hasan Adenium",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Hasan Adenium Logo"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasan Adenium - Wholesale & Retail Live Plant Nursery",
    description: "Buy premium live Adenium nursery plants online at wholesale prices.",
    images: ["/logo.png"]
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
      "@id": "https://hasanadenium.com/#store",
      "name": "Hasan Adenium",
      "alternateName": ["Hasan Adenium Nursery", "Hasan Adenium Wholesale"],
      "url": "https://hasanadenium.com",
      "logo": "https://hasanadenium.com/logo.png",
      "image": "https://hasanadenium.com/logo.png",
      "description": "Hasan Adenium is a premier wholesale & retail live plant nursery providing premium Adenium plants and garden plants.",
      "telephone": "+919153117740",
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
      "@id": "https://hasanadenium.com/#website",
      "url": "https://hasanadenium.com",
      "name": "Hasan Adenium",
      "alternateName": ["hasanadenium.com"],
      "description": "Buy wholesale & retail Adenium plants online from Hasan Adenium."
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
        <div className="mobile-app-container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
