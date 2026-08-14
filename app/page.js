"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronRight,
  FiGrid,
  FiHome,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiX
} from "react-icons/fi";
import { FaLeaf, FaSeedling, FaTree, FaWhatsapp } from "react-icons/fa";
import { GiFlowerPot, GiFlowerTwirl } from "react-icons/gi";
import { categories as defaultCategories } from "./data/categories";
import { useCart } from "./context/CartContext";
import ProductOptionsModal from "./components/ProductOptionsModal";

const heroImages = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
  "/hero/hero-4.jpg"
];

export default function Home() {

  const [showBottomNav, setShowBottomNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [dbCategories, setDbCategories] = useState([]);
  const [priceMode, setPriceMode] = useState("retail");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [optionsModalProduct, setOptionsModalProduct] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const { addItem, products, productsLoading, setIsSidebarOpen } = useCart();

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbCategories(data);
      })
      .catch(console.error);
  }, []);

  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryId 
      ? p.categoryId === activeCategoryId || p.category?.id === activeCategoryId || p.category?.slug === activeCategoryId 
      : true;
    
    // Filter by priceMode
    let matchesMode = true;
    if (priceMode === "wholesale") {
      matchesMode = p.type !== "Retail only"; // include "Wholesale only" and "Both Wholesale and retail"
    } else if (priceMode === "retail") {
      matchesMode = p.type !== "Wholesale only"; // include "Retail only" and "Both Wholesale and retail"
    }
    
    return matchesSearch && matchesCategory && matchesMode;
  });

  useEffect(() => {
    const checkScroll = () => {
      const atTop = window.scrollY <= 4;
      setShowBottomNav(!atTop);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const activeCategory = dbCategories.find(c => c.id === activeCategoryId || c.id === parseInt(activeCategoryId));
  const isAdenium = activeCategory?.slug?.toLowerCase() === 'adenium' || activeCategory?.name?.toLowerCase() === 'adenium';
  const heroStyle = isAdenium
    ? { background: 'url("https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/bpn/1782732499136_c85775c1-ac41-427e-85ce-6bb60f9a3a40__1_.png") center/cover no-repeat' }
    : { background: 'url("https://pub-ce8688bc6c654bcfb99716f7c9373bcd.r2.dev/Malatinursury/4c4556bc-0920-4575-97e6-94ba6de15e6f.png") center/cover no-repeat' };

  return (
    <main className="mobile-page">


      <header className="header">
        <button className="icon-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <FiMenu />
        </button>
        <Link href="/" className="header-center" aria-label="Hasan Adenium home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Hasan Adenium Logo" className="header-logo" style={{ height: '53px', width: 'auto', objectFit: 'contain', background: 'transparent' }} />
        </Link>
        <div className="header-actions">
          <Link href="/admin" className="icon-btn" aria-label="Admin Panel">
            <FiUser />
          </Link>
          <button className="icon-btn" aria-label="Shopping bag" onClick={() => setIsSidebarOpen(true)}>
            <FiShoppingBag />
          </button>
        </div>
      </header>

      <div className="search-wrap">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search plants, pots..." 
            aria-label="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery && (
        <>
          <section className="hero" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            {heroImages.map((imgUrl, idx) => (
              <div
                key={imgUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url("${imgUrl}")`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  opacity: idx === currentHeroIndex ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: 1
                }}
              />
            ))}
            <div className="hero-overlay" style={{ 
              position: 'relative', 
              zIndex: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'flex-start',
              height: '100%', 
              padding: '24px 20px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
              textAlign: 'left'
            }}>
              <span className="badge">NEW ARRIVALS</span>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '12px 0 16px 0', lineHeight: '1.3' }}>Hasan Adenium : rooted in quality , blooming with passion since 2004</h1>
            </div>
          </section>

          <div className="notice">
            <p className="notice-track">
              CALL Us for bulk order at 9153117740
            </p>
          </div>

          <div className="price-btn-container">
            <button 
              className={priceMode === "retail" ? "price-btn-active" : "price-btn-inactive"}
              onClick={() => setPriceMode("retail")}
            >
              Retail Price
            </button>
            <button 
              className={priceMode === "wholesale" ? "price-btn-active" : "price-btn-inactive"}
              onClick={() => setPriceMode("wholesale")}
            >
              <span style={{ color: 'red' }}>Wholesale Price</span>
            </button>
          </div>
        </>
      )}

      <section className="category-row" aria-label="Plant categories">
        <article 
          className={`category-modern ${activeCategoryId === null ? 'active' : ''}`}
          onClick={() => setActiveCategoryId(null)}
        >
          <div className="category-icon-modern tone-a">
            <FaTree />
          </div>
          <p>All Plants</p>
        </article>
        {dbCategories.map((category, index) => (
          <article 
            key={category.id} 
            className={`category-modern ${activeCategoryId === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategoryId(activeCategoryId === category.id ? null : category.id)}
          >
            <div className={`category-icon-modern tone-${index % 2 === 0 ? 'a' : 'b'}`}>
              <FaLeaf />
            </div>
            <p>{category.name}</p>
          </article>
        ))}
      </section>

      <section className="best-sellers">
        <div className="section-title">
          <h2 style={{ fontSize: '18px', color: '#1f6b2c', margin: '16px 0 8px 0' }}>Popular Nursery Plants</h2>
        </div>

        <div className="product-grid">
          {productsLoading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>Loading plants...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiSearch />
              </div>
              <h4>No plants found</h4>
              <p>We couldn't find any plants matching your search. Try adjusting your filters or browsing our categories.</p>
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>Clear Search</button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <article key={product.id || product.slug} className="product-card">
                <span className="offer-pill">{product.offer}</span>
                <Link href={`/product/${product.slug}?mode=${priceMode}`} className="product-image-link" style={{ display: 'block', overflow: 'hidden' }}>
                  <img src={product.image} alt={`Hasan Adenium Plant - ${product.title}`} loading="lazy" decoding="async" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </Link>
                <div className="product-info">
                  {product.category?.name && (
                    <span style={{ fontSize: '11px', color: '#1f6b2c', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.category.name}
                    </span>
                  )}
                  <p className="product-title">{product.title}</p>
                  <p className="product-rating">☆ ☆ ☆ ☆ ☆ 5.0 | 120 Reviews</p>
                  {priceMode !== "wholesale" && (
                    <div className="price-row">
                      <strong>₹{product.price}</strong>
                      {product.oldPrice && <span>₹{product.oldPrice}</span>}
                    </div>
                  )}
                  {priceMode === "wholesale" ? (
                    <Link href={`/product/${product.slug}?mode=${priceMode}`} className="add-btn ghost" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                      View Product
                    </Link>
                  ) : (
                    <button className="add-btn" onClick={() => setOptionsModalProduct(product)}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>




      {menuOpen && <button className="menu-overlay" aria-label="Close menu overlay" onClick={() => setMenuOpen(false)} />}
      <aside className={`side-menu ${menuOpen ? "open" : ""}`} aria-label="Website menu">
        <div className="side-menu-head">
          <strong>Menu</strong>
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="side-menu-links">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home <FiChevronRight />
          </Link>
          <button type="button" className="side-menu-link-btn" onClick={() => {
            setMenuOpen(false);
            setIsSidebarOpen(true);
          }}>
            Cart <FiChevronRight />
          </button>
          <Link href="/checkout" onClick={() => setMenuOpen(false)}>
            Checkout <FiChevronRight />
          </Link>

        </nav>
        <div className="menu-categories">
          <p>Categories</p>
          <div className="menu-category-grid">
            {dbCategories.map((item) => (
              <button 
                key={item.id} 
                type="button" 
                className="menu-category-item" 
                onClick={() => {
                  setActiveCategoryId(item.id);
                  setMenuOpen(false);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </aside>



      <nav className={`bottom-nav ${showBottomNav ? "visible" : ""}`} aria-label="Primary navigation">
        <Link href="/" className="bottom-item" aria-label="Home">
          <span className="bottom-icon">
            <FiHome />
          </span>
          <span>Home</span>
        </Link>
        <button className="bottom-item" type="button" aria-label="Menu" onClick={() => setMenuOpen(true)}>
          <span className="bottom-icon">
            <FiGrid />
          </span>
          <span>Menu</span>
        </button>
        <button className="bottom-item" type="button" aria-label="Cart" onClick={() => setIsSidebarOpen(true)}>
          <span className="bottom-icon">
            <FiPackage />
          </span>
          <span>Cart</span>
        </button>
        <a href="https://wa.me/919153117740" className="bottom-item" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <span className="bottom-icon" style={{ color: '#25D366' }}>
            <FaWhatsapp />
          </span>
          <span>WhatsApp</span>
        </a>
      </nav>

      <ProductOptionsModal
        isOpen={!!optionsModalProduct}
        onClose={() => setOptionsModalProduct(null)}
        product={optionsModalProduct}
        actionType="cart"
        onConfirm={(prod, q, opts) => {
          addItem(prod.slug, q, null, opts);
          setIsSidebarOpen(true);
        }}
      />
    </main>
  );
}
