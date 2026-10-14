const OtpForm = ({ handleSubmit, code, setCode, isLoading }) => {
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // auto focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedCode = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, code.length);

    if (!pastedCode) return;

    e.preventDefault();
    setCode([
      ...pastedCode,
      ...Array(code.length - pastedCode.length).fill(""),
    ]);
    document.getElementById(`code-${pastedCode.length - 1}`)?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Verification code digit ${index + 1}`}
            value={digit}
            disabled={isLoading}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-14 text-center text-2xl font-semibold text-gray-800 bg-gray-100 border-2 border-transparent rounded-xl focus:border-yellow-400 focus:bg-white focus:outline-none transition-all duration-200 shadow-sm"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-yellow-400 text-black hover:bg-yellow-500 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>
    </form>
  );
};

export default OtpForm;
