"use client";

import { useEffect, useState } from "react";
import LoginRegister from "./Login";
import Register from "./Register";
import VerifyEmail from "@/components/VerifyEmail";

import { AnimatePresence, motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";

const SideLogin = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const handleRegistrationSuccess = (email) => {
    setRegisteredEmail(email);
    setIsVerifyingEmail(true);
    setShowCloseConfirm(false);
  };

  const handleNeedsVerification = (email) => {
    setRegisteredEmail(email);
    setIsVerifyingEmail(true);
  };

  const handleBackToLogin = () => {
    setIsVerifyingEmail(false);
    setIsLogin(true);
  };

  const handleVerificationSuccess = () => {
    setIsVerifyingEmail(false);
    setIsLogin(true);
    setShowCloseConfirm(false);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setShowCloseConfirm(true);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`
      fixed inset-0 z-50
      ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
    `}
    >
      <div
        onClick={() => setShowCloseConfirm(true)}
        className={`
          absolute inset-0
          bg-black/40
          backdrop-blur-[2px]
          transition-opacity
          duration-500
          ease-in-out
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />
      <div
        className={`
          absolute
          right-0
          top-0
          h-full
          w-full
          sm:max-w-md
          md:max-w-lg
          lg:max-w-xl
          bg-gray-200
          shadow-2xl
          transform
          transition-transform
          duration-500
          ease-in-out
          ${
            isOpen
              ? "translate-x-0 pointer-events-auto"
              : "translate-x-full pointer-events-none"
          }
        `}
      >
        <button
          type="button"
          onClick={() => setShowCloseConfirm(true)}
          aria-label="Close login"
          className="absolute right-4
            top-4
            z-50
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-gray-100
            text-gray-600
            transition-all
            duration-200
            hover:bg-gray-200
            hover:text-gray-900
            hover:scale-105 cursor-pointer
          "
        >
          <HiXMark className="h-5 w-5" />
        </button>

        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            {/* Header */}
            {!isVerifyingEmail && (
              <div className="border-b border-gray-200 bg-gray-50 p-5">
                <div className="relative mx-auto flex h-14 w-full max-w-md rounded-xl bg-white p-1 shadow-sm">
                  {/* Active Background */}
                  <span
                    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)]
          rounded-lg bg-yellow-500 shadow-md
          transition-all duration-300 ease-in-out
          ${isLogin ? "translate-x-0" : "translate-x-full"}`}
                  />

                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`relative z-10 flex-1 rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer
            ${isLogin ? "text-black" : "text-gray-600 hover:text-black"}`}
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`relative z-10 flex-1 rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer
            ${!isLogin ? "text-black" : "text-gray-600 hover:text-black"}`}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* Body */}
            <div>
              <AnimatePresence mode="wait">
                {isVerifyingEmail ? (
                  <motion.div
                    key="verify-email"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <VerifyEmail
                      email={registeredEmail}
                      onBack={handleBackToLogin}
                      onVerified={handleVerificationSuccess}
                    />
                  </motion.div>
                ) : isLogin ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut",
                    }}
                  >
                    <LoginRegister
                      setShowCloseConfirm={setShowCloseConfirm}
                      onClose={onClose}
                      initialEmail={registeredEmail}
                      onNeedsVerification={handleNeedsVerification}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut",
                    }}
                  >
                    <Register
                      initialEmail={registeredEmail}
                      onRegistered={handleRegistrationSuccess}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* alert modal for close confirmation */}
      <AnimatePresence>
        {showCloseConfirm && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                    <svg
                      className="h-8 w-8 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.5 20h15a2 2 0 001.71-3.14l-7.5-13a2 2 0 00-3.42 0z"
                      />
                    </svg>
                  </div>
                </div>

                <p className="mt-2 text-center text-black font-medium">
                  Are you sure you want to close this panel? Your unsaved
                  changes may be lost.
                </p>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setShowCloseConfirm(false)}
                    className="flex-1 rounded border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      setShowCloseConfirm(false);
                      onClose();
                    }}
                    className="flex-1 rounded bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-600 cursor-pointer"
                  >
                    Yes, Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SideLogin;
