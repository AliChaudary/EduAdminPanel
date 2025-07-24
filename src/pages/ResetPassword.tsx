import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleReset = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setError("");

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 sm:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your registered email address. We’ll send a password reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 rounded-lg transition duration-150 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            Send Reset Email
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600 bg-green-50 p-2 rounded-md">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
