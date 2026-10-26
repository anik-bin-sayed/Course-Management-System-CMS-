import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const quickLinks = [
    "Upcoming Live Batch",
    "Free Courses",
    "Live Workshop",
    "AI Academy (Robi & Cirkle)",
    "Join As Instructor",
  ];

  const companyLinks = [
    "About Us",
    "Refund Policy",
    "Privacy Policy",
    "Terms And Conditions",
  ];

  // আপডেট করা ইমেজ লিঙ্ক
  const paymentMethods = [
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Bkash_Logo.svg/512px-Bkash_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Nagad_Logo.svg/512px-Nagad_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rocket_Logo.svg/512px-Rocket_Logo.svg.png",
  ];

  return (
    <footer className="w-full bg-[#fefcf3] pt-16 pb-8 font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#0f172a] tracking-tight">
                Learn Hub
              </span>
            </div>

            <p className="text-[#334155] text-[15px] leading-relaxed">
              Online Live Skill Development <br /> Platform
            </p>

            <div>
              <h4 className="text-[17px] font-bold text-[#0f172a] mb-3">
                Download Ostad App
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-24 h-10 bg-[#0f172a] rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  {/* গুগল প্লে স্টোর ইমেজ */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-full object-contain p-1"
                  />
                </a>
                <a
                  href="#"
                  className="w-24 h-10 bg-[#0f172a] rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  {/* অ্যাপ স্টোর ইমেজ */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                    alt="App Store"
                    className="h-full object-contain p-1"
                  />
                </a>
                <a
                  href="#"
                  className="w-14 h-10 bg-[#0f172a] rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-2.5 h-2.5 bg-[#f25022]"></div>
                    <div className="w-2.5 h-2.5 bg-[#7fba00]"></div>
                    <div className="w-2.5 h-2.5 bg-[#00a4ef]"></div>
                    <div className="w-2.5 h-2.5 bg-[#ffb900]"></div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <p className="text-[#334155] text-[15px] mb-3 leading-snug">
                Stay connected with the <br /> community
              </p>
              <div className="flex gap-2.5">
                <a
                  href="#"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[#1877F2] hover:bg-gray-50 transition-colors text-lg shadow-sm"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[#E1306C] hover:bg-gray-50 transition-colors text-lg shadow-sm"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[#FF0000] hover:bg-gray-50 transition-colors text-lg shadow-sm"
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-white border border-gray-200 rounded-md flex items-center justify-center text-[#0A66C2] hover:bg-gray-50 transition-colors text-lg shadow-sm"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[19px] font-bold text-[#0f172a] mb-6">
              Quick Link
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-[#334155] text-[15px] hover:text-black transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[19px] font-bold text-[#0f172a] mb-6">
              Contacts
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <FiMail className="text-[#0f172a] text-xl mt-0.5 shrink-0" />
                <a
                  href="mailto:support@ostad.app"
                  className="text-[#334155] text-[15px] hover:text-black transition-colors"
                >
                  support@ostad.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#0f172a] text-xl mt-0.5 shrink-0" />
                <span className="text-[#334155] text-[15px] leading-relaxed max-w-55">
                  Ka-6/a, Navana Sylwania, Baridhara Road, Nadda, Gulshan-2,
                  Dhaka-1212
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[19px] font-bold text-[#0f172a] mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-[#334155] text-[15px] hover:text-black transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
