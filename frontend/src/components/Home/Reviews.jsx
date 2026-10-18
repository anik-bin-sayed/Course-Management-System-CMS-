import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ name, batch, text, image }) => (
  <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-semibold">User</span>
        )}
      </div>
      <div>
        <h4 className="text-base font-bold text-gray-800">{name}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{batch}</p>
      </div>
      <div className="ml-auto text-yellow-400 text-sm flex gap-0.5">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
    <p className="text-[15px] text-gray-600 leading-relaxed">{text}</p>
  </div>
);

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-3">
          Learner Reviews
        </h2>
        <p className="text-center text-gray-500 text-base mb-12">
          See what our learners are saying
        </p>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((rev, idx) => (
            <ReviewCard key={idx} {...rev} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
