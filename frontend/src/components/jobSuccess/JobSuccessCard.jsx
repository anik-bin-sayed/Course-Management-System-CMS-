import React from "react";

const JobSuccessCard = ({ student }) => {
  return (
    <div className="bg-[#111827] rounded-xl p-5 text-center flex flex-col items-center border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Profile Image & Badge */}
      <div className="relative mb-3">
        <div className="w-20 h-20 rounded-full border-2 border-gray-600 overflow-hidden bg-gray-800">
          <img
            src={student.image}
            alt={student.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-gray-600 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          {student.batch}
        </div>
      </div>

      {/* Course Name */}
      <p className="text-[11px] text-gray-400 mt-2 line-clamp-1 w-full">
        {student.course}
      </p>

      {/* Name */}
      <h3 className="text-lg font-bold text-white mt-1">{student.name}</h3>

      {/* Position */}
      <p className="text-xs text-gray-300 mt-1 mb-2">
        Job Placed as {student.role} at:
      </p>

      {/* Company Badge */}
      <div className="bg-white text-black text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1.5 mb-3">
        {/* Simple placeholder for company logo */}
        <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
        {student.company}
      </div>

      {/* Review Text */}
      <p className="text-[11px] text-gray-400 leading-relaxed mt-auto line-clamp-3">
        {student.review}{" "}
        <span className="text-gray-500 font-medium cursor-pointer hover:text-white">
          See More
        </span>
      </p>
    </div>
  );
};

export default JobSuccessCard;
