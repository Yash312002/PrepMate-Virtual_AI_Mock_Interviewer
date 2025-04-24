"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
      router.push("/sign-in"); // Redirect to sign-in page after success
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address. Please check and try again.");
      } else {
        toast.error("Failed to send password reset email. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/sign-in")}
        className="self-start mb-4 text-primary-100 font-bold flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Sign In
      </button>

      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-center mb-6">
        Enter your email address below, and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-primary-100 text-white rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;