import React from "react";
import { FaQuoteRight } from "react-icons/fa";

const LearnerReviews = () => {
  const reviews = [
    {
      id: 1,
      text: "ওস্তাদ-এর MERN কোর্সটি স্কিল ডেভেলপমেন্টের জন্য অনেক হেল্পফুল একটি কোর্স। আমার প্রতিটি প্রবলেমই তারা লাইভ ক্লাসেই সলভ করার চেষ্টা করেছে। এছাড়াও সাপোর্ট ইন্সট্রাক্টরও অনেক ডালো। এসব কারণে MERN এর লার্নিং জার্নিটা আমার জন্য ছিল অসাধারণ।",
      name: "Faisal Azam Siddiqui",
      batch: "Full Stack Web Development with MERN Batch 1",
      avatar: "FA",
      avatarColor: "bg-gray-800",
    },
    {
      id: 2,
      text: "Ostad এর বিশেষত্ব হচ্ছে ওনারা ডিজাইনার চেয়েও ডিজাইন সাইকোলজিতে ফোকাস বেশি দেয়। একজন স্কিলফুল ডিজাইনার হিসেবে কাজ করতে আমার অনেক উপকারে এসেছে। ইন্ডাস্ট্রি ফোকাসড এই প্রাক্টিস আমাকে প্রফেশনালি অনেক হেল্প করেছে।",
      name: "Shafayet Rana",
      batch: "UX/UI Batch 6",
      avatar: "SR",
      avatarColor: "bg-[#1e293b]",
    },
    {
      id: 3,
      text: "ক্লাস আলহামদুলিল্লাহ যেভাবে চেয়েছি পেয়েছি। কোর্সের থেকে অনেক কিছু পেয়েছি। ইন্সট্রাক্টর অনেক ডালো ছিল। ওভারঅল অনেক এজুয়া করেছি, ওভারঅল স্যাটিসফাইড।",
      name: "Abu Hasan",
      batch: "UX/UI Batch 17",
      avatar: "AH",
      avatarColor: "bg-[#0f172a]",
    },
    {
      id: 4,
      text: "এই কোর্সটি হচ্ছে আমার লাইফে করা one of the best course! লার্নিং এক্সপেরিয়েন্স বলেন বা ওস্তাদ টিমের সাপোর্ট বলেন, সবই ছিল অসাধারণ! একদম বেসিক থেকে এত সুন্দরভাবে ডিটেইলস দেখানো হয়েছে, যে আমি অনেক কিছুই শেখার সুযোগ পেয়েছি।",
      name: "Jahid Hossain",
      batch: "Full Stack Web Development with MERN Batch 2",
      avatar: "JH",
      avatarImage: "https://i.pravatar.cc/150?img=11",
      avatarColor: "bg-gray-200",
    },
    {
      id: 5,
      text: "Even though I come from a non-CS background, I felt that understanding data science would help me advance in my profession. In order to do so, I enrolled in an Ostad Data Science course. I believed it would be tough for me to understand without prior knowledge, but after taking the Ostad Data course, I learned that it is simple to crack and that they made it even easier.",
      name: "MD Galib Hasan",
      batch: "Data Science Certificate Program Batch 09",
      avatar: "MG",
      avatarColor: "bg-[#1e293b]",
    },
    {
      id: 6,
      text: "সাজানো গোছানো একদম পরিপূর্ণ গাইডলাইন সমৃদ্ধ একটি কোর্স। আমার মত এই কোর্স এর সিডিউল এর বাইরে আলাদা করে আর কোনো সাপোর্ট প্রয়োজন হয়নি।",
      name: "Md Ashfaque Ul Hoque",
      batch: "UX/UI Batch 6",
      avatar: "MA",
      avatarImage: "https://i.pravatar.cc/150?img=33",
      avatarColor: "bg-gray-200",
    },
    {
      id: 7,
      text: "The Data Science program delivered by Ostad is perfect for me. I would recommend to anyone who might be interested to take the course.",
      name: "ARM Salahuddin",
      batch: "Data Science Certificate Program batch 19",
      avatar: "AR",
      avatarImage: "https://i.pravatar.cc/150?img=47",
      avatarColor: "bg-gray-200",
    },
    {
      id: 8,
      text: "MERN নিয়ে আমার এক্সপেরিয়েন্স ১০০% ফুলফিল হয়েছে। সব প্রোজেক্টেই ওস্তাদ-এ পেয়েছি ইন্সট্যান্ট সাপোর্ট। এ কারণে আমি ভুল করে করেও শেখার সাহস করতে পেরেছি। ধন্যবাদ ওস্তাদকে। ওস্তাদ এর কোর্স আমি সবসময় রেকমেন্ড করবো।",
      name: "Nayem Islam",
      batch: "Full Stack Web Development with MERN Batch 2",
      avatar: "NI",
      avatarColor: "bg-[#1e293b]",
    },
  ];

  return (
    <div className=" bg-gray-50 flex flex-col items-center py-12 px-4 font-sans pb-10">
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-[42px] font-bold text-[#0f172a] mb-4 tracking-tight">
          Learner Reviews
        </h2>
        <p className="text-gray-600 text-lg">
          See what our learners are saying
        </p>
      </div>

      <div className="w-full max-w-300 mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="break-inside-avoid bg-white border border-gray-200 rounded-lg p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
          >
            <p className="text-[#334155] text-sm leading-relaxed mb-4">
              {review.text}
            </p>

            <hr className="border-gray-100 mb-4" />

            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0 ${review.avatarColor}`}
                >
                  {review.avatarImage ? (
                    <img
                      src={review.avatarImage}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    review.avatar
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-[#1e293b] text-[15px]">
                    {review.name}
                  </h3>
                  <p className="text-gray-500 text-[13px] mt-0.5">
                    {review.batch}
                  </p>
                </div>
              </div>

              <FaQuoteRight className="text-[#facc15] text-2xl mb-1 shrink-0 ml-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnerReviews;
