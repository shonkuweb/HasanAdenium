"use client";

import React from "react";
import { FiX, FiPlus, FiShoppingBag, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export default function MinOrderPopup({
  isOpen,
  onClose,
  currentQty = 1,
  minQty = 5,
  products = [],
  onAddItem,
  onProceed
}) {
  if (!isOpen) return null;

  const neededQty = Math.max(0, minQty - currentQty);
  const isComplete = currentQty >= minQty;

  // Filter 4 recommended products
  const suggestedProducts = (products || []).slice(0, 4);

  return (
    <div className="min-order-modal-overlay" onClick={onClose}>
      <div className="min-order-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="min-order-modal-header">
          <div className="min-order-header-title">
            <span className="min-order-icon-badge">📦</span>
            <div>
              <h3>Minimum Order Notice</h3>
              <p>Hasan Adenium Wholesale & Retail Policy</p>
            </div>
          </div>
          <button className="min-order-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Dynamic Status Banner */}
        <div className="min-order-body">
          {!isComplete ? (
            <div className="min-order-alert-box">
              <div className="min-order-alert-text">
                <strong>Minimum order quantity is {minQty} items.</strong>
                <p>You currently have <span>{currentQty} item(s)</span> in your cart.</p>
              </div>
              <div className="min-order-progress-badge">
                Add <strong>{neededQty}</strong> more item(s) to proceed
              </div>
            </div>
          ) : (
            <div className="min-order-success-box">
              <div className="min-order-success-text">
                <FiCheck className="success-icon" />
                <div>
                  <strong>Minimum Order Quantity Reached!</strong>
                  <p>You have {currentQty} items in your cart. Ready to complete your order.</p>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Products Section */}
          <div className="min-order-suggested-section">
            <div className="suggested-section-head">
              <FaLeaf className="leaf-icon" />
              <h4>Suggested Plants to Complete Your Order</h4>
            </div>

            <div className="min-order-suggested-grid">
              {suggestedProducts.map((product) => (
                <div key={product.id || product.slug} className="suggested-product-card">
                  <div className="suggested-img-wrap">
                    <img src={product.image || "/logo.png"} alt={product.title} />
                  </div>
                  <div className="suggested-info">
                    <p className="suggested-title">{product.title}</p>
                    <div className="suggested-price-row">
                      <span className="suggested-price">₹{product.price}</span>
                      <button
                        className="suggested-add-btn"
                        onClick={() => onAddItem && onAddItem(product.slug, 1)}
                      >
                        <FiPlus /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="min-order-modal-footer">
          {isComplete ? (
            <button
              className="min-order-action-btn primary"
              onClick={() => {
                onClose();
                if (onProceed) onProceed();
              }}
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          ) : (
            <button className="min-order-action-btn secondary" onClick={onClose}>
              Continue Adding Items
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
