export default function AuthCheckFallback({ onRetry, inline = false }) {
  return (
    <div
      className={`flex items-center justify-center px-4 py-8 ${
        inline ? "min-h-48 w-full" : "min-h-screen w-full"
      }`}
      role="alert"
    >
      <div className="text-center">
        <p className="text-sm text-gray-700">
          Unable to verify your session. Check your connection and retry.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}