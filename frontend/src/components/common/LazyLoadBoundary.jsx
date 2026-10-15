import { Component } from "react";

const LoadingFallback = ({ label = "Loading page", variant = "route" }) => {
  const containerClass =
    variant === "modal"
      ? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      : variant === "inline"
        ? "flex min-h-48 items-center justify-center px-4 py-8"
        : "flex min-h-[50vh] items-center justify-center px-4 py-12";

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={
          variant === "modal"
            ? "flex items-center gap-3 rounded bg-white px-5 py-4 shadow-xl"
            : "flex items-center gap-3 text-gray-600"
        }
      >
        <span
          className="h-7 w-7 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default class LazyLoadBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-12 text-center"
          role="alert"
        >
          <p className="font-semibold text-gray-900">
            This view could not be loaded.
          </p>
          <p className="text-sm text-gray-600">
            Check your connection and reload the page to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-yellow-500"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { LoadingFallback };
