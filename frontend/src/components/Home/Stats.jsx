import { FaUserGraduate, FaUsers, FaChartPie, FaVideo } from "react-icons/fa";

const StatCard = ({ icon, value, label, bgColor, iconColor, textColor }) => (
  <div
    className={`group ${bgColor} flex flex-col items-center justify-center rounded-2xl border border-gray-200/70 p-7 text-center shadow-[0_8px_30px_-24px_rgba(16,37,29,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-30px_rgba(16,37,29,0.38)] sm:p-8`}
  >
    {/* Icon */}
    <div className={`mb-4 text-4xl transition-transform duration-300 group-hover:scale-105 md:text-5xl ${iconColor}`}>
      {icon}
    </div>

    {/* Number */}
    <h3 className={`text-3xl md:text-4xl font-extrabold ${textColor} mb-1`}>
      {value}
    </h3>

    {/* Label */}
    <p className="text-sm font-semibold text-gray-600">{label}</p>
  </div>
);

const Stats = () => {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUserGraduate />}
            value="10,000+"
            label="Job Placement"
            bgColor="bg-[#E0F2F1]"
            iconColor="text-[#00796B]"
            textColor="text-[#004D40]"
          />

          <StatCard
            icon={<FaUsers />}
            value="100,000+"
            label="Learner"
            bgColor="bg-[#F3E5F5]"
            iconColor="text-[#7B1FA2]"
            textColor="text-[#4A148C]"
          />

          <StatCard
            icon={<FaChartPie />}
            value="93%"
            label="Course Completion Rate"
            bgColor="bg-[#FFEBEE]"
            iconColor="text-[#D32F2F]"
            textColor="text-[#B71C1C]"
          />

          <StatCard
            icon={<FaVideo />}
            value="21"
            label="Live Course"
            bgColor="bg-[#FFF8E1]"
            iconColor="text-[#F57F17]"
            textColor="text-[#E65100]"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
