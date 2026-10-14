"use client";

import { useRouter, useSearchParams } from "@/lib/navigation";
import { useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";

import { MdOutlineMail } from "react-icons/md";
import OtpForm from "./OtpForm";
import Link from "@/components/common/AppLink";
import { useVerifyEmailMutation } from "../../lib/features/auth/authApi";
import { toast } from "sonner";

const VerifyEmail = ({ email: providedEmail, onBack, onVerified }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = providedEmail || searchParams.get("email");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [feedback, setFeedback] = useState(null);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const verificationCode = code.join("");

    if (!email || verificationCode.length !== 6) {
      setFeedback({
        type: "error",
        message: !email
          ? "Verification email is missing. Please register again."
          : "Enter the complete 6-digit verification code.",
      });
      return;
    }

    setFeedback(null);
    try {
      await verifyEmail({ email, code: verificationCode }).unwrap();
      toast.success("Email verified successfully.");

      if (onVerified) {
        onVerified();
      } else {
        router.replace("/");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error?.data?.detail ||
          error?.error ||
          "Email verification failed. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
            <MdOutlineMail className="w-10 h-10 text-black" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          We have sent a 6-digit verification code to your email. Please enter
          it below.
        </p>

        {email && (
          <div className="my-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
              <FiMail className="text-lg" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                Email Address
              </p>
              <p className="truncate text-sm font-semibold text-slate-800">
                {email}
              </p>
            </div>

            <FiCheckCircle className="ml-auto shrink-0 text-lg text-emerald-500" />
          </div>
        )}

        {/* OTP Form */}
        <OtpForm
          handleSubmit={handleSubmit}
          code={code}
          setCode={setCode}
          isLoading={isLoading}
        />

        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`mt-4 text-center text-sm ${
              feedback.type === "error" ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {feedback.message}
          </p>
        )}

        {/* Resend */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Verification codes expire after 10 minutes. Code resend is not
          available yet.
        </p>

        {/* Back */}
        <p className="text-center text-sm text-gray-400 mt-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="hover:text-gray-500 transition"
            >
              ← Back to Sign In
            </button>
          ) : (
            <Link href="/" className="hover:text-gray-500 transition">
              ← Back to Home
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
