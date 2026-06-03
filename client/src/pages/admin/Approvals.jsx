import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingProducts, updateProductStatus } from "../../api/admin";
import { formatINR } from "../../utils/unitConversion";

export default function Approvals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await getPendingProducts();
      setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pending approvals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    let rejection_reason = null;
    if (status === 'rejected') {
      rejection_reason = window.prompt("Reason for rejection:");
      if (rejection_reason === null) return; // User cancelled prompt
    }

    try {
      await updateProductStatus(id, { status, rejection_reason });
      // Remove handled product from UI
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Failed to update status");
      console.error("Update failed", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review new products listed by sellers. Approved products will hit the master catalogue.
          </p>
        </div>
        <div className="mt-4 flex sm:ml-4 sm:mt-0">
           <Link to="/admin/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y border divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product Details</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Seller Info</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Listing Price / Stock</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan="4" className="px-3 py-8 text-center text-sm text-gray-500">Loading queue...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="4" className="px-3 py-8 text-center text-sm text-gray-500">Hooray! The pending queue is completely empty.</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-gray-500 mt-1 max-w-xs truncate" title={product.description}>
                             {product.description || "No description provided."}
                          </div>
                          {product.category && <div className="text-xs text-blue-600 mt-1">{product.category}</div>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{product.seller_name}</div>
                          <div className="text-gray-500">{product.seller_email}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                          <div className="font-medium">{formatINR(product.price_per_base_unit)} <span className="text-gray-400 font-normal">/ {product.base_unit}</span></div>
                          <div className="text-gray-500 mt-1">{Number(product.stock_in_base_unit)} <span className="text-xs">{product.base_unit} available</span></div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center sm:pr-6">
                          <button
                            onClick={() => handleAction(product.id, 'approved')}
                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(product.id, 'rejected')}
                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}