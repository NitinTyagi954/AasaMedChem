import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalog } from "../../api/buyer";
import useCartStore from "../../store/cartStore";
import { formatINR } from "../../utils/unitConversion";

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem, items: cartItems } = useCartStore();

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await getCatalog();
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch catalog", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    // Default quantity to 1 base unit
    addItem(product, 1);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="mt-2 text-sm text-gray-500">Browse approved chemicals and reagents from our verified sellers.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/buyer/cart" className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart ({cartItems.length})
          </Link>
          <Link to="/buyer/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later for new listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => {
            const isInCart = cartItems.some(item => item.id === product.id);
            return (
              <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex-1 p-4 space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2" title={product.description}>{product.description || "No description provided."}</p>
                  <div className="mt-2 flex flex-col justify-end">
                    <p className="text-sm font-medium text-gray-900">
                      {formatINR(product.price_per_base_unit)} <span className="text-gray-500 font-normal">/ {product.base_unit}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Available: {Number(product.stock_in_base_unit)} {product.base_unit}</p>
                    <p className="text-xs text-gray-500">Seller: {product.seller_name}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  {isInCart ? (
                    <Link
                      to="/buyer/cart"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Go to Cart &rarr;
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
