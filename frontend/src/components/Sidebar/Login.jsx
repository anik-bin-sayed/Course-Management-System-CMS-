"use client";

import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCheckEmailMutation,
  useGetProfileQuery,
  useLoginMutation,
} from "../../lib/features/auth/authApi";

const LoginRegister = ({
  onClose,
  setShowCloseConfirm,
  initialEmail = "",
  onNeedsVerification,
}) => {
  const [step, setStep] = useState(1);

  // FORM DATA
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  // LOADING

  // ERRORS
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // RTK QUERY
  const [checkEmail, { isLoading: isCheckingEmail }] = useCheckEmailMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  // EMAIL VALIDATION
  const validateEmail = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    let valid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // PASSWORD VALIDATION
  const validatePassword = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    let valid = true;

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // EMAIL CHANGE
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setErrors((prev) => ({
      ...prev,
      email: "",
    }));
  };

  // PASSWORD CHANGE
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    setErrors((prev) => ({
      ...prev,
      password: "",
    }));
  };

  // CHECK EMAIL
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      const response = await checkEmail({
        email: email.trim().toLowerCase(),
      }).unwrap();

      if (response.exists) {
        setStep(2);
      } else {
        toast.error("No account found with this email.");

        setErrors((prev) => ({
          ...prev,
          email: "No account found with this email",
        }));
      }
    } catch (error) {
      if (
        error?.status === 403 &&
        /verify/i.test(error?.data?.detail || error?.data?.message || "")
      ) {
        onNeedsVerification?.(email.trim().toLowerCase());
        return;
      }

      if (error?.status === 404) {
        toast.error("No account found with this email.");
      } else {
        toast.error(
          error?.data?.detail ||
            error?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      onClose();
      setShowCloseConfirm(false);
      refetchProfile();
    } catch (error) {
      console.error("Login failed:", error);

      if (
        error?.status === 403 &&
        /verify/i.test(error?.data?.detail || error?.data?.message || "")
      ) {
        onNeedsVerification?.(email.trim().toLowerCase());
        return;
      }

      if (error?.status === 401) {
        toast.error("Invalid email or password.");

        setErrors((prev) => ({
          ...prev,
          password: "Invalid password",
        }));
      } else {
        toast.error(
          error?.data?.detail ||
            error?.data?.message ||
            "Login failed. Please try again.",
        );
      }
    }
  };

  // BACK TO EMAIL
  const handleBack = () => {
    setStep(1);
    setPassword("");
    setErrors({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center px-4 py-8 md:py-0 m">
      <div className="w-full max-w-sm sm:px-8 sm:py-6 md:px-10 md:py-8">
        {/* LOGO */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xl font-bold text-gray-900">Learn</span>

          <span className="text-xl bg-yellow-500 rounded px-2 py-1 font-bold text-gray-900">
            Hub
          </span>
        </div>
        <AnimatePresence mode="wait">
          {/* step 1 */}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <>
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome Back
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter your email to continue
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                      autoFocus
                      disabled={isCheckingEmail}
                      className={`
                    w-full
                    px-4
                    py-2.5
                    sm:py-3
                    rounded-xl
                    border
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-yellow-500"
                    }
                    bg-gray-50/50
                    text-gray-900
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:border-transparent
                    transition-all
                    duration-200
                    text-sm
                    sm:text-base
                    disabled:opacity-60
                  `}
                    />

                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Continue Button */}
                  <button
                    type="submit"
                    disabled={isCheckingEmail}
                    className="
                  w-full
                  py-2.5
                  sm:py-3.5
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-black
                  font-bold
                  rounded-xl
                  shadow-md
                  shadow-yellow-500/30
                  hover:shadow-yellow-500/40
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  text-sm
                  sm:text-base
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                  >
                    {isCheckingEmail ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Checking...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>
              </>
            </motion.div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Enter Password
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter your password to continue
                  </p>
                </div>

                {/* Email Preview */}
                <div className="mb-4 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-400">Email</p>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {email}
                    </p>

                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>

                      <a
                        href="#"
                        className="text-xs sm:text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoFocus
                      disabled={isLoggingIn}
                      className={`
                    w-full
                    px-4
                    py-2.5
                    sm:py-3
                    rounded-xl
                    border
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-yellow-500"
                    }
                    bg-gray-50/50
                    text-gray-900
                    placeholder-gray-400
                    focus:outline-none
                    focus:ring-2
                    focus:border-transparent
                    transition-all
                    duration-200
                    text-sm
                    sm:text-base
                    disabled:opacity-60
                  `}
                    />

                    {errors.password && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 accent-yellow-500"
                      />
                      Remember me
                    </label>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="
                  w-full
                  py-2.5
                  sm:py-3.5
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-black
                  font-bold
                  rounded-xl
                  shadow-md
                  shadow-yellow-500/30
                  hover:shadow-yellow-500/40
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  text-sm
                  sm:text-base
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                  >
                    {isLoggingIn ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </>
            </motion.div>
          )}
        </AnimatePresence>
        {/* SOCIAL LOGIN */}

        <div className="flex items-center gap-3 my-6 sm:my-8">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-xs text-gray-400 font-medium">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              sm:py-3
              border
              border-gray-300
              rounded-xl
              hover:bg-gray-50
              transition-colors
              duration-200
              text-sm
              font-medium
              text-gray-700
              hover:shadow-sm
            "
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>

          <button
            type="button"
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              sm:py-3
              border
              border-gray-300
              rounded-xl
              hover:bg-gray-50
              transition-colors
              duration-200
              text-sm
              font-medium
              text-gray-700
              hover:shadow-sm
            "
          >
            <FaGithub className="w-5 h-5" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
