"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiShoppingBag, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export const PRODUCT_AGE_OPTIONS = [
  "2 year old",
  "4 year old",
  "6 year old",
  "8 year old",
  "grafted on 8 old arabicum rootstock"
];

export default function ProductOptionsModal({
  isOpen,
  onClose,
  product,
  actionType = "cart", // "cart" or "buyNow"
  onConfirm
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [qty, setQty] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedOptions([]);
      setQty(1);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const toggleOption = (option) => {
    setErrorMsg("");
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleConfirm = () => {
    if (selectedOptions.length === 0) {
      setErrorMsg("Please select at least one option to proceed.");
      return;
    }
    if (onConfirm) {
      onConfirm(product, qty, selectedOptions);
    }
    onClose();
  };

  return (
    <div className="min-order-modal-overlay" onClick={onClose}>
      <div
        className="min-order-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "480px" }}
      >
        {/* Modal Header */}
        <div className="min-order-modal-header">
          <div className="min-order-header-title">
            <span className="min-order-icon-badge" style={{ background: "#e8f5e9", color: "#1f6b2c" }}>
              <FaLeaf />
            </span>
            <div>
              <h3>Select Plant Specification</h3>
              <p style={{ fontSize: "12px", color: "#666" }}>{product.title}</p>
            </div>
          </div>
          <button className="min-order-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="min-order-body" style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#222", marginBottom: "6px" }}>
            Choose Age / Rootstock Options (Select multiple if needed):
          </p>

          {errorMsg && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                marginBottom: "12px",
                fontWeight: "500"
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "12px 0 16px 0" }}>
            {PRODUCT_AGE_OPTIONS.map((opt) => {
              const isChecked = selectedOptions.includes(opt);
              return (
                <label
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: isChecked ? "2px solid #1f6b2c" : "1px solid #e0e0e0",
                    background: isChecked ? "#f0f7f2" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isChecked ? "0 2px 8px rgba(31, 107, 44, 0.12)" : "none"
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: isChecked ? "2px solid #1f6b2c" : "2px solid #aaa",
                      background: isChecked ? "#1f6b2c" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "12px",
                      flexShrink: 0,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isChecked && <FiCheck strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: isChecked ? "600" : "500", color: "#333" }}>
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Quantity Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "#f9f9f9",
              borderRadius: "10px",
              marginTop: "8px"
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#444" }}>Quantity:</span>
            <div className="qty-box" style={{ margin: 0 }}>
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <FiMinus />
              </button>
              <strong>{qty}</strong>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
              >
                <FiPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="min-order-modal-footer" style={{ padding: "16px 20px" }}>
          <button
            className="min-order-action-btn primary"
            onClick={handleConfirm}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {actionType === "buyNow" ? (
              <>
                Proceed to Checkout <FiArrowRight />
              </>
            ) : (
              <>
                <FiShoppingBag /> Confirm & Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
