import { FiList, FiPlus, FiX } from "react-icons/fi";

const MAX_OUTCOMES = 20;

export default function LearningOutcomesEditor({ outcomes = [], onChange }) {
  const updateOutcome = (index, value) => {
    onChange(outcomes.map((outcome, currentIndex) => (currentIndex === index ? value : outcome)));
  };

  const removeOutcome = (index) => {
    onChange(outcomes.filter((_, currentIndex) => currentIndex !== index));
  };

  const addOutcome = () => {
    if (outcomes.length < MAX_OUTCOMES) onChange([...outcomes, ""]);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-slate-900">
            <FiList className="text-emerald-800" aria-hidden="true" />
            <h2 className="text-lg font-semibold">What students will learn</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Add clear, specific outcomes that will appear on the course details page.
          </p>
        </div>
        <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {outcomes.length}/{MAX_OUTCOMES}
        </span>
      </div>

      {outcomes.length > 0 ? (
        <div className="space-y-2.5">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-semibold text-emerald-800">
                {String(index + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                value={outcome}
                onChange={(event) => updateOutcome(index, event.target.value)}
                maxLength={200}
                aria-label={`Learning outcome ${index + 1}`}
                placeholder="e.g. Build and deploy a full-stack web application"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-900/5"
              />
              <button
                type="button"
                onClick={() => removeOutcome(index)}
                aria-label={`Remove learning outcome ${index + 1}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
          No learning outcomes added yet.
        </div>
      )}

      <button
        type="button"
        onClick={addOutcome}
        disabled={outcomes.length >= MAX_OUTCOMES}
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-800/20 bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiPlus aria-hidden="true" /> Add an outcome
      </button>
    </section>
  );
}
