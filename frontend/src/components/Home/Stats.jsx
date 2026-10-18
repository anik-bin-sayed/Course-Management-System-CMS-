import { FaUserGraduate, FaUsers, FaChartPie, FaVideo } from "react-icons/fa";

const StatCard = ({ icon, value, label, bgColor, iconColor, textColor }) => (
  <div
    className={`${bgColor} rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow duration-300`}
  >
    {/* Icon */}
    <div className={`text-4xl md:text-5xl mb-4 ${iconColor}`}>{icon}</div>

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
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
