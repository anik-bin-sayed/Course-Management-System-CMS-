const InfoCard = ({ icon, title, value }) => {
  const isUrl = (text) => {
    if (!text || text === "-") return false;

    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="group flex min-h-[92px] min-w-0 items-start gap-3 rounded-lg border border-slate-200/80 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/60">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 transition-colors group-hover:bg-emerald-100">
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <h4 className="mt-1 break-all text-sm font-semibold leading-5 text-slate-800">
        {isUrl(value) ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-800 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
        </h4>
      </div>
    </div>
  );
};

export default InfoCard;
