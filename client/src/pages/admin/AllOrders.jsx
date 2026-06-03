import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../api/admin";
import { formatINR } from "../../utils/unitConversion";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">System Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Master overview of all transactions executing through the platform.
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Parties Involved</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Amount</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">Loading orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">No orders have been placed yet.</td></tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6">
                           {o.id.substring(0, 8)}...
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>Buyer: <span className="font-medium text-gray-900">{o.buyer_name}</span></div>
                          <div>Seller: <span className="font-medium text-gray-900">{o.seller_name}</span></div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          {formatINR(o.total_amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                          {o.status}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(o.created_at).toLocaleDateString()}
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