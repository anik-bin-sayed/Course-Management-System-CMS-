import { useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FiBriefcase } from "react-icons/fi";

const JobSuccessCard = ({ student }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = student.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const companyInitial = student.company.trim().charAt(0).toUpperCase();

  return (
    <article className="group flex min-h-[300px] flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-[0_8px_24px_-20px_rgba(16,37,29,0.38)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_40px_-25px_rgba(16,37,29,0.32)]">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-[#eff6f1] text-sm font-bold text-[#1b704b]">
          {student.image && !imageFailed ? (
            <img
              src={student.image}
              alt={student.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <span className="inline-flex rounded-md bg-[#f3f7f4] px-2 py-1 text-[11px] font-semibold text-[#547160]">
            {student.batch}
          </span>
          <h3 className="mt-2 line-clamp-2 text-base font-bold capitalize leading-5 text-[#17251d]">
            {student.name}
          </h3>
        </div>
      </div>

      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#eff6f1] text-[#1b704b]">
            <FiBriefcase className="text-sm" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Placed as</p>
            <p className="mt-0.5 text-sm font-semibold leading-5 text-gray-800">
              {student.role}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-gray-100 bg-[#fafcfb] px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-[#1b704b] shadow-sm ring-1 ring-gray-100">
            {companyInitial}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Company
            </p>
            <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-700">
              {student.company}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        {student.review && (
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-gray-500">
            <FaQuoteLeft className="mr-1 inline text-[10px] text-[#84a08f]" />
            {student.review}
          </p>
        )}
        <p className="mt-3 line-clamp-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Course: </span>
          {student.course}
        </p>
      </div>
    </article>
  );
};

export default JobSuccessCard;
