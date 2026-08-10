import { prisma } from "../../../lib/prisma";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      return {
        title: "Product Not Found | Hasan Adenium",
        description: "Explore live Adenium & nursery plants at Hasan Adenium Panskura."
      };
    }

    const title = `Buy ${product.title} Live Plant Online - Wholesale & Retail | Hasan Adenium`;
    const description = product.description
      ? `${product.description.slice(0, 150)}... Buy ${product.title} live nursery plant online at Hasan Adenium Panskura at wholesale & retail price.`
      : `Buy ${product.title} live plant online at best wholesale and retail prices from Hasan Adenium Panskura. High quality live nursery plant delivery across India.`;

    return {
      title,
      description,
      keywords: [
        product.title,
        `buy ${product.title} online`,
        `${product.title} wholesale nursery`,
        `${product.title} price`,
        "Hasan Adenium",
        "nursery plant",
        "wholesale nursery Panskura"
      ],
      alternates: {
        canonical: `https://hasanadenium.com/product/${slug}`
      },
      openGraph: {
        title,
        description,
        url: `https://hasanadenium.com/product/${slug}`,
        siteName: "Hasan Adenium",
        images: product.image ? [{ url: product.image, alt: `Hasan Adenium - ${product.title}` }] : [],
        type: "article"
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.image ? [product.image] : []
      }
    };
  } catch (error) {
    return {
      title: "Nursery Plant | Hasan Adenium",
      description: "Buy live nursery plants online at wholesale and retail rates from Hasan Adenium Panskura."
    };
  }
}

export default async function ProductLayout({ children, params }) {
  const { slug } = await params;
  let productJsonLd = null;

  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (product) {
      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.image ? [product.image] : [],
        "description": product.description || `Buy ${product.title} live plant from Hasan Adenium.`,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "Hasan Adenium"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://hasanadenium.com/product/${product.slug}`,
          "priceCurrency": "INR",
          "price": product.price,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Hasan Adenium"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating || "5.0",
          "reviewCount": product.reviews || "120"
        }
      };
    }
  } catch (e) {
    // Ignore schema build error
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
