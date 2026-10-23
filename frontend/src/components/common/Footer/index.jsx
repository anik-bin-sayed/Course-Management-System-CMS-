import Link from "@/components/common/AppLink";

import { FaFacebookF, FaYoutube, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { SiGoogledisplayandvideo360 } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:pr-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-lg">
                Learn
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Hub
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-500">
              Learn new skills, improve your knowledge, and grow your career
              with our free and premium video courses.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
              >
                <FaFacebookF className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
              >
                <FaYoutube className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
              >
                <FaGithub className="h-4 w-4" />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400 hover:text-gray-950"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Courses
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Free Courses
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Paid Courses
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Programming
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Web Development
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Data Structures
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  All Courses
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Instructors
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  className="text-gray-500 transition-colors hover:text-yellow-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Get In Touch
            </h3>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <FiMail className="h-4 w-4 text-yellow-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <span className="text-gray-600">support@learnhub.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <FiPhone className="h-4 w-4 text-yellow-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <span className="text-gray-600">+880 1234-567890</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                  <FiMapPin className="h-4 w-4 text-yellow-500" />
                </div>

                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <span className="text-gray-600">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            <p className="text-gray-400">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-gray-600">LearnHub</span>. All
              rights reserved.
            </p>

            <div className="flex items-center gap-5">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Privacy Policy
              </Link>

              <span className="h-4 w-px bg-gray-200" />

              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-yellow-500"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
