import React from "react";
import JobSuccessCard from "../components/jobSuccess/JobSuccessCard";
import {
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaBriefcase,
  FaLaptopCode,
  FaPaintBrush,
  FaChartLine,
} from "react-icons/fa";

// Demo Data based on the image
const students = [
  {
    id: 1,
    name: "anupom mojumder",
    course: "Master AI Automation & Build AI Agents (No Code)",
    batch: "Batch 5",
    role: "Voice AI and Automation specialist",
    company: "Eruclience",
    image: "https://i.pravatar.cc/150?img=11",
    review:
      "Sourav Bhai's mentorship helped me a lot throughout my learning journey. His unique approach...",
  },
  {
    id: 2,
    name: "Mahmudul Hasan Shiblee",
    course: "AI & ML Engineering Bootcamp",
    batch: "Batch 2",
    role: "Associate AI Engineer",
    company: "Mysoft Heaven",
    image: "https://i.pravatar.cc/150?img=13",
    review:
      "I first discovered Ostad through a webinar and then decided to enroll in a course...",
  },
  {
    id: 3,
    name: "Md Shakil Ahamed",
    course: "Full Stack Web Development with PHP, Laravel &...",
    batch: "Batch 3",
    role: "Web Developer",
    company: "Unique Prime Engineering Solutions",
    image: "https://i.pravatar.cc/150?img=14",
    review:
      "Alhamdulillah! I have completed the PHP Laravel course from Ostad and am currently...",
  },
  {
    id: 4,
    name: "Mohammad Emon",
    course: "UI UX Design Career Track Program",
    batch: "Batch 6",
    role: "Junior UI/UX Designer",
    company: "Shomvob Jobs",
    image: "https://i.pravatar.cc/150?img=15",
    review:
      "Learning UI/UX Design from Ostad helped me build a strong foundation in user-centric...",
  },
  {
    id: 5,
    name: "Md. Shahadot Hossain",
    course: "Full Stack Web Development with JavaScript...",
    batch: "Batch 4",
    role: "Intern",
    company: "Solutya Pvt. Ltd.",
    image: "https://i.pravatar.cc/150?img=53",
    review:
      "Enrolling in the Full Stack Development course at Ostad was a great decision! The...",
  },
  {
    id: 6,
    name: "Waheduzzaman Anik",
    course: "Complete Network Engineering Career Track...",
    batch: "Batch 2",
    role: "Technical support engineer",
    company: "Bdcom Online Limited",
    image: "https://i.pravatar.cc/150?img=50",
    review: "", // Empty in image
  },
  {
    id: 7,
    name: "Shaharia Tanna",
    course: "SQA: Manual & Automated Testing",
    batch: "Batch 1",
    role: "Junior SQA and operation Engineer",
    company: "Truck Lagbe",
    image: null, // Use default icon
    review: "",
  },
  {
    id: 8,
    name: "Md.Sazid Istiaq",
    course: "SQA: Manual & Automated Testing",
    batch: "Batch 2",
    role: "SQA Engineer",
    company: "Akaar IT Limited",
    image: null,
    review: "",
  },
  {
    id: 9,
    name: "Bijpro Saha",
    course: "SQA: Manual & Automated Testing",
    batch: "Batch 2",
    role: "SQA Engineer",
    company: "DavNet Limited",
    image: null,
    review: "",
  },
  {
    id: 10,
    name: "Md Ferdous Hasan",
    course: "SQA: Manual & Automated Testing",
    batch: "Batch 3",
    role: "SQA Engineer",
    company: "BD Funel Builder Limited",
    image: null,
    review: "",
  },
  {
    id: 11,
    name: "Lamia Haider",
    course: "Full Stack Web Development with Python, Djang...",
    batch: "Batch 3",
    role: "Jr web Developer",
    company: "Dokmi",
    image: null,
    review: "",
  },
  {
    id: 12,
    name: "Moinuddin Muhammad Imtiaz Bhuiyan",
    course: "Full Stack Web Development with Python, Djang...",
    batch: "Batch 5",
    role: "Assistant Engineer",
    company: "Tekvision (BD) Limited",
    image: "https://i.pravatar.cc/150?img=60",
    review: "",
  },
  {
    id: 13,
    name: "Md. Rafiul Islam",
    course: "UI UX Design Career Track Program",
    batch: "Batch 3",
    role: "Executive UI/UX Designer",
    company: "Softvence Agency",
    image: null,
    review: "",
  },
  {
    id: 14,
    name: "Shahriar Alom Bhuiyan",
    course: "UI UX Design Career Track Program",
    batch: "Batch 3",
    role: "UI/UX Designer",
    company: "Sparktech Agency",
    image: "https://i.pravatar.cc/150?img=68",
    review: "",
  },
  {
    id: 15,
    name: "MD. ABDUL HAMIM",
    course: "App Development with Flutter",
    batch: "Batch 3",
    role: "Flutter Developer",
    company: "NEONECY",
    image: "https://i.pravatar.cc/150?img=59",
    review:
      "My learning journey at Ostad helped me achieve 13th position in my batch, while th... See More",
  },
  {
    id: 16,
    name: "MD. Sizanur Rahman",
    course: "UI UX Design Career Track Program",
    batch: "Batch 3",
    role: "Junior UI/UX Designer",
    company: "Softvence Agency",
    image: "https://i.pravatar.cc/150?img=58",
    review: "",
  },
];

const JobSuccess = () => {
  return (
    <div className="bg-white min-h-screen mt-16">
      {/* Hero Banner */}
      <div className="bg-[#8B5CF6] py-12 px-4 text-center text-white max-w-6xl mx-auto ">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 font-sans">
          Successful Job Placement
        </h1>
        <p className="text-sm md:text-base opacity-90">
          Dhukkul's successful learners have secured job placements at various
          renowned organizations, as listed below.
        </p>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {students.map((student) => (
              <JobSuccessCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSuccess;
