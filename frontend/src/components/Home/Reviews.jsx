import { FaQuoteLeft, FaStar } from "react-icons/fa";

const ReviewCard = ({ name, batch, text, image }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_8px_30px_-24px_rgba(16,37,29,0.45)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_48px_-30px_rgba(16,37,29,0.4)] sm:p-7">
      <div className="mb-5 flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff6f1] text-[#1b704b] transition duration-300 group-hover:bg-[#e1f1e7]">
          <FaQuoteLeft className="text-sm" />
        </span>
        <div
          className="flex items-center gap-1 rounded-full bg-[#fff8df] px-3 py-1.5 text-xs text-[#c28a00]"
          aria-label="5 out of 5 stars"
        >
          {Array.from({ length: 5 }, (_, star) => (
            <FaStar key={star} />
          ))}
        </div>
      </div>

      <p className="grow text-[15px] leading-7 text-gray-700">“{text}”</p>

      <div className="mt-7 flex items-center gap-3 border-t border-gray-100 pt-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#173c2d] text-sm font-bold text-white ring-4 ring-[#eff6f1]">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-[#17251d]">{name}</h3>
          <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500">
            {batch}
          </p>
        </div>
        <span className="ml-auto self-start rounded-full bg-[#f4f7f5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#547160]">
          Learner
        </span>
      </div>
    </article>
  );
};

const Reviews = () => {
  const reviews = [
    {
      name: "Faisal Alam Siddiqui",
      batch: "Full Stack Web Development",
      text: "ওয়েব ডেভেলপমেন্ট শেখার জন্য অসাধারণ একটি প্ল্যাটফর্ম। এখানকার মেন্টররা খুবই হেল্পফুল।",
    },
    {
      name: "Shafayet Karim",
      batch: "Graphic Design",
      text: "I highly recommend this course. The mentors are very helpful and the community is great. I landed a job within 3 months of completing the course at DhukKul.",
    },
    {
      name: "Afnan Hasan",
      batch: "Digital Marketing",
      text: "ডিজিটাল মার্কেটিং এর বেসিক থেকে অ্যাডভান্স সব কিছু খুব সুন্দরভাবে শেখানো হয়েছে।",
    },
    {
      name: "Sajid Hossain",
      batch: "MERN Stack",
      text: "The best decision I made was joining DhukKul. The curriculum is updated and industry-relevant.",
    },
    {
      name: "Md Galib Hasan",
      batch: "Data Science",
      text: "Data Science course is very detailed. The instructors explain complex topics easily.",
    },
    {
      name: "Md Abdullah Al Noman",
      batch: "App Development",
      text: "DhukKul helped me build my career. The job placement team is very supportive.",
    },
  ];

  return (
    <section className="bg-[#f7faf8] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#276143]">
            Learner stories
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#17251d] sm:text-4xl">
            Learner reviews
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-600">
            See what learners say about their learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
