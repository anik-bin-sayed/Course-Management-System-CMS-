"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRegisterMutation } from "../../lib/features/auth/authApi";

const initialFormData = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
};
const RegisterComponent = ({ onRegistered, initialEmail = "" }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    email: initialEmail,
  }));
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validate Email
  const validateEmail = () => {
    let valid = true;

    const newErrors = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // Validate Full Name
  const validateFullName = () => {
    let valid = true;

    const newErrors = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // Validate Password
  const validatePassword = () => {
    let valid = true;

    const newErrors = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    };

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // Next Button
  const handleNext = () => {
    if (step === 1) {
      if (validateEmail()) {
        setStep(2);
      }

      return;
    }

    if (step === 2) {
      if (validateFullName()) {
        setStep(3);
      }
    }
  };

  // Back Button
  const handleBack = () => {
    setErrors({
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    });

    setStep((prev) => prev - 1);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const { confirmPassword, ...formDataToSubmit } = formData;
      const response = await register(formDataToSubmit).unwrap();
      onRegistered?.(response.user.email);
    } catch (error) {
      toast.error(
        error?.data?.detail ||
          error?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex justify-center bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="w-full max-w-sm">
        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>

          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && "Enter your email to get started"}
            {step === 2 && "Tell us your full name"}
            {step === 3 && "Create a secure password"}
          </p>
        </div>

        {/* STEP INDICATOR */}

        <div className="flex items-center justify-center gap-2 mb-7">
          {/* Step 1 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 1
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > 1 ? "✓" : "1"}
          </div>

          <div
            className={`h-1 w-12 rounded-full transition-all duration-300 ${
              step >= 2 ? "bg-yellow-500" : "bg-gray-200"
            }`}
          />

          {/* Step 2 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 2
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > 2 ? "✓" : "2"}
          </div>

          <div
            className={`h-1 w-12 rounded-full transition-all duration-300 ${
              step >= 3 ? "bg-yellow-500" : "bg-gray-200"
            }`}
          />

          {/* Step 3 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 3
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>
        {/* Step text */}
        <p className="text-center text-xs text-gray-400 mb-5">
          Step {step} of 3
        </p>
        <AnimatePresence mode="wait">
          {/* STEP 1 - EMAIL */}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                >
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoFocus
                    className={`w-full px-3.5 py-3 rounded-xl border ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-yellow-500"
                    } bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-md shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    Next
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-200" />

                  <span className="text-[10px] text-gray-400 font-medium">
                    OR SIGN UP WITH
                  </span>

                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    {/* Google Icon */}
                    <FcGoogle className="w-4 h-4" />
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    {/* GitHub Icon */}
                    <FaGithub className="w-4 h-4" />
                    GitHub
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2 - FULL NAME */}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoFocus
                    className={`w-full px-3.5 py-3 rounded-xl border ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-yellow-500"
                    } bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Selected Email */}
                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-[11px] text-gray-400">Email</p>

                  <p className="text-sm text-gray-700 font-medium truncate">
                    {formData.email}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5 mt-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-md shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 - PASSWORD */}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit}>
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoFocus
                      className={`w-full px-3.5 py-3 rounded-xl border ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-yellow-500"
                      } bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm`}
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-3.5 py-3 rounded-xl border ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-yellow-500"
                      } bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm`}
                    />

                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="mt-4">
                    <div className="flex items-start gap-2">
                      <input
                        id="agreeTerms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);

                          setErrors((prev) => ({
                            ...prev,
                            agreeTerms: "",
                          }));
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 accent-yellow-500"
                      />

                      <label
                        htmlFor="agreeTerms"
                        className="text-xs text-gray-600 cursor-pointer leading-relaxed"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {errors.agreeTerms && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2.5 mt-5">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isLoading}
                      className="w-1/3 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-md shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-black"
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
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterComponent;
