import { useTranslation } from "react-i18next";
import JobSuccessCard from "../components/jobSuccess/JobSuccessCard";
import { FaBriefcase } from "react-icons/fa";

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
  const { t } = useTranslation();

  return (
    <main className="mt-16 min-h-screen bg-[#f7faf8] pb-16 pt-7 sm:pt-10">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-[#173c2d] px-6 py-9 text-white shadow-[0_18px_45px_-30px_rgba(16,37,29,0.65)] sm:px-10 sm:py-12 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-14 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#ffd84d]">
              <FaBriefcase aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {t("jobSuccessPage.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              {t("jobSuccessPage.description")}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label={t("jobSuccessPage.title")}
        className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {students.map((student) => (
            <JobSuccessCard key={student.id} student={student} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default JobSuccess;
