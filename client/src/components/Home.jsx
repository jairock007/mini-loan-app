import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PlusCircle, ChevronDown, ChevronUp, Trash2, LogOut } from "lucide-react";

const Home = () => {
  const [loans, setLoans] = useState([]);
  const { user, token, setLoggedIn, setUser } = useContext(AuthContext);
  const [showDetails, updateShowDetails] = useState("-1");
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };
  const navigate = useNavigate();

  const fetchLoans = async () => {
    try {
      const loanData = await axios.get(
        "http://localhost:5000/api/v1/loans",
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      const loansWithInitializedAdditionalAmount = loanData.data.Loans.map(loan => ({
        ...loan,
        repayments: loan.repayments.map(repayment => ({
          ...repayment,
          additionalAmount: 0
        }))
      }));
      setLoans(loansWithInitializedAdditionalAmount);
    } catch (err) {
      s
      toast.error(`Can't fetch the loans\nError: ${err}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/loans/update-status/`,
        { id, status },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      toast.success("Updated the loan status");
      fetchLoans();
    } catch (error) {
      toast.error(`Can't update status!`);
    }
  };

  const updatePayment = async (loanId, installmentId, additionalAmount) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/loans/repay/`,
        { loanId, installmentId, additionalAmount },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      toast.success("Paid the installment");
      fetchLoans();
    } catch (error) {
      toast.error(`Can't pay installment!`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/loans/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          bearertoken: token,
        },
      });
      toast.success("Loan deleted successfully");
      fetchLoans();
    } catch (error) {
      toast.error(`Can't delete loan!\nError:${error}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const toggleDetails = (loanId) => {
    updateShowDetails(showDetails === loanId ? "-1" : loanId);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Info Card */}
        {user && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Create Loan Button */}
        {user && user.user_type !== "admin" && (
          <div className="mb-6">
            <a
              href="/createLoan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusCircle size={20} />
              Create New Loan
            </a>
          </div>
        )}

        {/* Loans Display */}
        {loans.length > 0 ? (
          <div className="space-y-6">
            {loans.map((loan, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div className="p-6 space-y-6">
                  {/* Main Loan Info with Grid Layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="mt-1 text-2xl font-bold text-blue-600"> ₹{loan.amount}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Terms</p>
                      <p className="mt-1 text-2xl font-bold text-indigo-600">{loan.terms}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`mt-2 px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Created Date</p>
                      <p className="mt-1 text-lg font-semibold text-gray-700">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Admin Info */}
                  {user.user_type === "admin" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">User ID</p>
                        <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">{loan.user_id._id}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1 font-semibold">{loan.user_id.name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-blue-600">{loan.user_id.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col items-center pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex justify-center gap-3 w-full">
                      {user && user.user_type === "admin" && loan.status === "pending" ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => updateStatus(loan._id, "accepted")}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(loan._id, "rejected")}
                            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                          >
                            Reject
                          </button>
                        </div>
                      ) : loan.status !== "rejected" ? (
                        <button
                          onClick={() => toggleDetails(loan._id)}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                          {showDetails === loan._id ? (
                            <>
                              Hide Details
                              <ChevronUp size={18} />
                            </>
                          ) : (
                            <>
                              View Details
                              <ChevronDown size={18} />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg">Rejected</span>
                      )}
                    </div>

                    {user.user_type === "admin" && (
                      <button
                        onClick={() => handleDelete(loan._id)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    )}
                  </div>

                  {/*Loan Details */}
                  {showDetails === loan._id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                            <span className="ml-2 text-xl font-bold text-blue-600">₹{loan.amount}</span>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-500">Remaining Amount:</span>
                            <span className="ml-2 text-xl font-bold text-indigo-600">₹{loan.remainingAmount}</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                  <div className="flex items-center h-full">Amount</div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                  <div className="flex items-center h-full">Due Date</div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                  <div className="flex items-center h-full">Status</div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                  <div className="flex items-center h-full">Action</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {loan.repayments.map((repay, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center h-full">
                                      ₹{parseFloat(repay.amount) + (repay.additionalAmount || 0)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center h-full">
                                      {new Date(repay.date).toLocaleDateString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center h-full">
                                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${repay.status === 'paid'
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                        {repay.status}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {repay.status === "pending" && (
                                      <div className="flex items-center gap-3 h-full">
                                        <input
                                          type="number"
                                          placeholder="Additional amount"
                                          onChange={(e) => {
                                            const additionalAmount = parseFloat(e.target.value) || 0;
                                            const updatedRepayments = [...loan.repayments];
                                            updatedRepayments[index].additionalAmount = additionalAmount;
                                            setLoans(prevLoans => {
                                              const updatedLoans = [...prevLoans];
                                              updatedLoans[idx].repayments = updatedRepayments;
                                              return updatedLoans;
                                            });
                                          }}
                                          className="px-3 py-2 w-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        />
                                        <button
                                          disabled={loan.status !== "accepted"}
                                          onClick={() => updatePayment(loan._id, repay._id, repay.additionalAmount)}
                                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                        >
                                          Repay
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">No loans found!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;