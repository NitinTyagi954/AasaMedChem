import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/products";
import { toBaseQuantity, toBasePrice, getBaseUnit } from "../../utils/unitConversion";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    displayUnit: "kg", // Default selected from user dropdown
    displayPrice: "",
    displayStock: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Apply correct Conversions to DB base sizes
      const baseUnit = getBaseUnit(form.displayUnit);
      const stockInBaseUnit = toBaseQuantity(form.displayStock, form.displayUnit);
      const pricePerBaseUnit = toBasePrice(form.displayPrice, form.displayUnit);

      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        description: form.description,
        base_unit: baseUnit,
        price_per_base_unit: pricePerBaseUnit,
        stock_in_base_unit: stockInBaseUnit,
      };

      await createProduct(payload);
      navigate("/seller/listings"); // After creating go to listings
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const dtClasses = "block text-sm font-medium text-gray-700";
  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">List New Product</h2>
      </div>

      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        {error && <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label htmlFor="name" className={dtClasses}>Product Name</label>
              <input type="text" id="name" required className={inputClasses}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="sku" className={dtClasses}>SKU (Optional)</label>
              <input type="text" id="sku" className={inputClasses}
                value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="category" className={dtClasses}>Category</label>
              <input type="text" id="category" className={inputClasses}
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={dtClasses}>Description</label>
              <textarea id="description" rows={3} className={inputClasses}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="displayUnit" className={dtClasses}>Selling Unit</label>
              <select id="displayUnit" className={inputClasses}
                value={form.displayUnit} onChange={(e) => setForm({ ...form, displayUnit: e.target.value })}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="L">Liters (L)</option>
                <option value="mL">Milliliters (mL)</option>
                <option value="unit">Units / Pieces</option>
              </select>
            </div>

            <div>
              <label htmlFor="displayPrice" className={dtClasses}>Price (per {form.displayUnit})</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input type="number" step="0.01" id="displayPrice" required className={`${inputClasses} pl-7`}
                  value={form.displayPrice} onChange={(e) => setForm({ ...form, displayPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="displayStock" className={dtClasses}>Available Stock Inventory (in {form.displayUnit})</label>
              <input type="number" step="0.01" id="displayStock" required className={inputClasses}
                value={form.displayStock} onChange={(e) => setForm({ ...form, displayStock: e.target.value })}
              />
            </div>

          </div>

          <div className="flex justify-end pt-5">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? "Saving..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
