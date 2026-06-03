import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import { placeOrder } from "../../api/buyer";
import { formatINR, toBaseQuantity } from "../../utils/unitConversion";

function getAutoDisplay(quantity, baseUnit) {
  if (baseUnit === 'g') {
    return quantity >= 1000 ? { value: quantity / 1000, unit: 'kg' } : { value: quantity, unit: 'g' };
  }
  if (baseUnit === 'mL') {
    return quantity >= 1000 ? { value: quantity / 1000, unit: 'L' } : { value: quantity, unit: 'mL' };
  }
  return { value: quantity, unit: baseUnit };
}

const CartItemRow = ({ item, updateQuantity, removeItem }) => {
  const autoDisplay = getAutoDisplay(item.quantity, item.base_unit);
  const [displayVal, setDisplayVal] = useState(autoDisplay.value);
  const [displayUnit, setDisplayUnit] = useState(autoDisplay.unit);

  // Sync local state if global store changes (e.g. initial mount)
  useEffect(() => {
    const currentBase = toBaseQuantity(displayVal, displayUnit);
    // Only update local state if it's significantly different from the store to avoid cursor jump
    if (Math.abs(currentBase - item.quantity) > 0.001) {
       const auto = getAutoDisplay(item.quantity, item.base_unit);
       setDisplayVal(auto.value);
       setDisplayUnit(auto.unit);
    }
  }, [item.quantity, displayVal, displayUnit, item.base_unit]);

  const handleValueChange = (e) => {
    const val = e.target.value;
    setDisplayVal(val);
    if (val !== "" && !isNaN(val)) {
      const baseQ = toBaseQuantity(val, displayUnit);
      updateQuantity(item.id, baseQ);
    }
  };

  const handleUnitChange = (e) => {
    const unit = e.target.value;
    setDisplayUnit(unit);
    if (displayVal !== "" && !isNaN(displayVal)) {
      const baseQ = toBaseQuantity(displayVal, unit);
      updateQuantity(item.id, baseQ);
    }
  };

  const availableUnits = item.base_unit === 'g' ? ['g', 'kg'] : item.base_unit === 'mL' ? ['mL', 'L'] : [item.base_unit];

  return (
    <li className="px-4 py-5 sm:px-6 flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">Seller: {item.seller_name}</p>
        <p className="text-sm text-gray-500 mt-1">
          {formatINR(item.price_per_base_unit)} / {item.base_unit}
        </p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
          <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
          <input
            id={`quantity-${item.id}`}
            type="number"
            min="0"
            step="any"
            className="focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-0 py-2 px-3 text-gray-900"
            value={displayVal}
            onChange={handleValueChange}
          />
          <select
            className="focus:ring-blue-500 focus:border-blue-500 py-2 pl-2 pr-6 border-l border-gray-300 bg-gray-50 text-gray-700 sm:text-sm"
            value={displayUnit}
            onChange={handleUnitChange}
          >
            {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="text-right min-w-[100px]">
          <p className="text-lg font-medium text-gray-900">
            {formatINR(item.price_per_base_unit * item.quantity)}
          </p>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 p-2"
          title="Remove item"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, getTotalCost } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        items: items.map(item => ({
          id: item.id,
          seller_id: item.seller_id,
          quantity: item.quantity,
          base_unit: item.base_unit,
          price_per_base_unit: item.price_per_base_unit
        }))
      };
      
      await placeOrder(payload);
      alert("Order placed successfully!");
      clearCart();
      navigate("/buyer/orders");
    } catch (error) {
      console.error("Checkout failed", error);
      alert(error.response?.data?.error || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
        <Link to="/buyer/products" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          &larr; Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Looks like you haven't added any chemicals yet.</p>
          <div className="mt-6">
            <Link to="/buyer/products" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <CartItemRow 
                key={item.id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeItem={removeItem} 
              />
            ))}
          </ul>
          
          <div className="bg-gray-50 px-4 py-5 sm:px-6 flex justify-between items-center border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Total amount (excluding taxes/shipping)</p>
              <p className="text-2xl font-extrabold text-gray-900">{formatINR(getTotalCost())}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Processing...' : 'Checkout Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
