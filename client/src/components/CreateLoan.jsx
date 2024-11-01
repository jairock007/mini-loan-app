import { useContext, useState } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CreditCard, Calendar, ArrowLeft, SendHorizontal } from "lucide-react";

const CreateLoan = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!amount || !term) throw "Please fill in all fields!";
      await axios.post(
        "http://localhost:5000/api/v1/loans/create",
        { amount, terms: term },
        {
          headers: {
            "Content-Type": "application/json",
            bearertoken: token,
          },
        }
      );
      toast.success("Loan created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create loan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <CreditCard size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Apply for a Loan
            </h2>
            <p className="text-gray-500 mt-2">Fill in the details below to submit your loan application</p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loan Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter loan amount"
                  required
                />
              </div>
            </div>

            {/* Term Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Loan Term (in weeks)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-500" />
                </div>
                <input
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter loan term"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <SendHorizontal size={20} />
              Submit Application
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Loan terms are specified in weeks</li>
              <li>• Minimum loan amount is ₹100</li>
              <li>• Applications are typically reviewed within 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLoan;