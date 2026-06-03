import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../api/admin";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">System Accounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A master list of every Admin, Seller, and Buyer currently registered on AasaMedChem.
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Account ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">Loading accounts...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="5" className="px-3 py-8 text-center text-sm text-gray-500">No users found.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-500 sm:pl-6">
                           {u.id.substring(0, 8)}...
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{u.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium capitalize
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                            ${u.role === 'seller' ? 'bg-blue-100 text-blue-800' : ''}
                            ${u.role === 'buyer' ? 'bg-green-100 text-green-800' : ''}
                          `}>
                            {u.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(u.created_at).toLocaleDateString()}
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