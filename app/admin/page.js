"use client";
import { useState, useEffect } from "react";
import { FiUpload, FiTrash2, FiPlus, FiTag, FiEdit2, FiSearch, FiX, FiPackage, FiLayers, FiImage, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Mobile active tab state ('inventory' | 'form')
  const [mobileTab, setMobileTab] = useState('inventory');
  
  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Image preview state
  const [imagePreview, setImagePreview] = useState('');
  
  // Edit mode state
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  
  // New product form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  // Category management state
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Adenium options state
  const [adeniumPrice8, setAdeniumPrice8] = useState("");
  const [adeniumPrice10, setAdeniumPrice10] = useState("");
  const [adeniumPriceSingle, setAdeniumPriceSingle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (existingImage) {
      setImagePreview(existingImage);
    } else {
      setImagePreview("");
    }
  }, [file, existingImage]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (slug) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products?slug=${slug}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setTitle(product.title);
    setSlug(product.slug);
    setPrice(product.price);
    setDescription(product.description || "");
    setExistingImage(product.image);
    setType(product.type || "");
    setCategoryId(product.categoryId || product.category?.id || "");
    setFile(null);

    if (product.adeniumOptions) {
      setAdeniumPrice8(product.adeniumOptions["Multigrafted 8\" Pot"] || "");
      setAdeniumPrice10(product.adeniumOptions["Multigrafted 10\" Pot"] || "");
      setAdeniumPriceSingle(product.adeniumOptions["Single Grafted"] || "");
    } else {
      setAdeniumPrice8("");
      setAdeniumPrice10("");
      setAdeniumPriceSingle("");
    }
    
    setMobileTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTitle("");
    setSlug("");
    setPrice("");
    setDescription("");
    setExistingImage("");
    setFile(null);
    setImagePreview("");
    setType("");
    setCategoryId("");
    setAdeniumPrice8("");
    setAdeniumPrice10("");
    setAdeniumPriceSingle("");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add category");
      }
      setNewCatName("");
      fetchData();
      alert("Category added successfully!");
    } catch (err) {
      alert("Error adding category: " + err.message);
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      fetchData();
      alert("Category deleted successfully!");
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!title || !slug || !price) {
      alert("Title, Slug, and Price are required!");
      return;
    }
    if (!editingProductId && !file) {
      alert("Image is required for new products!");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = existingImage;

      // 1. Compress and Upload the image if a new file is selected
      if (file) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const formData = new FormData();
        formData.append("file", new File([compressedFile], file.name, { type: compressedFile.type }));
        formData.append("type", type);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }

        imageUrl = uploadData.url;
      }

      // 2. Save the product
      const isAdenium = title.toLowerCase().includes('adenium');
      const adeniumOptions = isAdenium ? {
        "Multigrafted 8\" Pot": adeniumPrice8 || null,
        "Multigrafted 10\" Pot": adeniumPrice10 || null,
        "Single Grafted": adeniumPriceSingle || null
      } : undefined;

      const productData = {
        slug,
        title,
        price,
        description,
        image: imageUrl,
        type,
        rating: 5.0,
        reviews: 120,
        adeniumOptions,
        categoryId: categoryId || null
      };

      let res;
      if (editingProductId) {
        productData.id = editingProductId;
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingProductId ? 'update' : 'save'} product`);
      }

      // 3. Reset form
      handleCancelEdit();
      
      // 4. Switch back to inventory tab on mobile after save
      setMobileTab('inventory');

      // 5. Refresh list
      fetchData();
      alert(`Product ${editingProductId ? 'updated' : 'added'} successfully!`);

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.price && p.price.toString().includes(q))
    );
  });

  const adeniumCount = products.filter(p => p.title.toLowerCase().includes('adenium')).length;

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      {/* Mobile View Switcher */}
      <div className="admin-mobile-nav">
        <button 
          className={`admin-mobile-nav-btn ${mobileTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setMobileTab('inventory')}
        >
          <FiPackage /> Inventory ({products.length})
        </button>
        <button 
          className={`admin-mobile-nav-btn ${mobileTab === 'form' ? 'active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          {editingProductId ? <><FiEdit2 /> Edit Item</> : <><FiPlus /> Add Item</>}
        </button>
      </div>

      <main className="admin-main" style={{ margin: 0 }}>
        <div className="admin-content-grid">
          
          {/* Add / Edit Product Column */}
          <div className={`admin-left-col ${mobileTab !== 'form' ? 'mobile-tab-hidden' : ''}`}>
            <section className="admin-card add-product-section">
              <h2>
                <span className="admin-card-icon">{editingProductId ? <FiEdit2 /> : <FiPlus />}</span>
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmitProduct} className="admin-form">
                <div className="form-group">
                  <label>Product Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={handleTitleChange} 
                    placeholder="e.g. Rare Hoya Compacta" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="">Select a Type</option>
                    <option value="Both Wholesale and retail">Both Wholesale and retail</option>
                    <option value="Wholesale only">Wholesale only</option>
                    <option value="Retail only">Retail only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category (Optional)</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {title.toLowerCase().includes('adenium') && (
                  <div className="admin-adenium-box">
                    <h3>Adenium Special Options</h3>
                    <div className="admin-adenium-fields">
                      <div className="form-group">
                        <label>Multigrafted 8" Pot (₹)</label>
                        <input type="number" value={adeniumPrice8} onChange={e => setAdeniumPrice8(e.target.value)} placeholder="e.g. 500" />
                      </div>
                      <div className="form-group">
                        <label>Multigrafted 10" Pot (₹)</label>
                        <input type="number" value={adeniumPrice10} onChange={e => setAdeniumPrice10(e.target.value)} placeholder="e.g. 800" />
                      </div>
                      <div className="form-group">
                        <label>Single Grafted (₹)</label>
                        <input type="number" value={adeniumPriceSingle} onChange={e => setAdeniumPriceSingle(e.target.value)} placeholder="e.g. 300" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="299" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Product description..." 
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  {imagePreview && (
                    <div className="admin-image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div className="preview-badge">
                        <FiCheckCircle /> {file ? "New File Selected" : "Current Image"}
                      </div>
                    </div>
                  )}
                  <div className="file-upload-wrapper">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setFile(e.target.files[0])} 
                      required={!editingProductId}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <FiUpload /> {file ? file.name : (editingProductId ? "Choose a new image (optional)..." : "Choose an image to upload...")}
                    </label>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="admin-submit-btn" disabled={isUploading}>
                    {isUploading ? "Saving..." : (editingProductId ? "Update Product" : "Save Product")}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={handleCancelEdit} className="admin-cancel-btn">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* Category Management Section */}
            <section className="admin-card add-category-section" style={{ marginTop: '24px' }}>
              <h2>
                <span className="admin-card-icon"><FiTag /></span>
                Manage Categories ({categories.length})
              </h2>
              <form onSubmit={handleAddCategory} className="admin-form" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Add New Custom Category</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={newCatName} 
                      onChange={(e) => setNewCatName(e.target.value)} 
                      placeholder="e.g. Rare Succulents, Outdoor Palms..." 
                      required 
                    />
                    <button type="submit" className="admin-submit-btn" disabled={isAddingCat} style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 16px' }}>
                      {isAddingCat ? "Adding..." : "+ Add Category"}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="admin-category-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {categories.map((cat) => (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8faf8', border: '1px solid #e2e8e2', borderRadius: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>{cat.name}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>
                        ({cat._count?.products || 0} products)
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteCategory(cat.id, cat.name)} 
                      className="admin-action-btn admin-delete-action"
                      title="Delete Category"
                      aria-label="Delete Category"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Manage Inventory Column */}
          <section className={`admin-card product-list-section ${mobileTab !== 'inventory' ? 'mobile-tab-hidden' : ''}`}>
            <div className="admin-card-header-flex">
              <h2>
                <span className="admin-card-icon"><FiPackage /></span>
                Manage Inventory
              </h2>
            </div>

            {/* Overview Stats */}
            <div className="admin-stats-summary">
              <div className="stat-badge">
                <FiPackage className="stat-icon" />
                <span><strong>{products.length}</strong> Total Items</span>
              </div>
              <div className="stat-badge stat-adenium">
                <FiLayers className="stat-icon" />
                <span><strong>{adeniumCount}</strong> Adeniums</span>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="admin-search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search products by title, type, category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="search-clear-btn" aria-label="Clear search">
                  <FiX />
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="admin-loading">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="admin-empty">
                <p>{searchQuery ? `No products match "${searchQuery}"` : "No products found. Add some to get started!"}</p>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="admin-btn-secondary" style={{marginTop: '8px', padding: '8px 16px'}}>
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="admin-product-list">
                {filteredProducts.map(product => (
                  <div key={product.id || product.slug} className="admin-product-item">
                    <div className="admin-product-image">
                      <img src={product.image} alt={product.title} />
                    </div>
                    <div className="admin-product-details">
                      <h3>{product.title}</h3>
                      <div className="admin-product-meta">
                        <span className="product-price">₹{product.price}</span>
                        {product.type && <span className="product-type-badge">{product.type}</span>}
                      </div>
                      {product.category?.name && (
                        <span className="product-cat-badge">
                          <FiTag style={{ marginRight: '4px' }} />
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="admin-item-actions">
                      <button 
                        onClick={() => handleEditProduct(product)} 
                        className="admin-action-btn admin-edit-action"
                        title="Edit Product"
                        aria-label="Edit Product"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.slug)} 
                        className="admin-action-btn admin-delete-action"
                        title="Delete Product"
                        aria-label="Delete Product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
