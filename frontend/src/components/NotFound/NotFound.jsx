"use client";

import Link from "@/components/common/AppLink";
import {
    FiArrowLeft,
    FiBookOpen,
    FiHome,
    FiSearch,
} from "react-icons/fi";

const NotFound = () => {
    return (
        <main className="h-[calc(100vh-0px)] bg-gradient-to-br from-slate-50 via-white to-amber-200 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center mt-20">
                <div className="w-full text-center">

                    {/* Icon */}
                    <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-300 shadow-lg shadow-yellow-200">
                        <FiBookOpen className="text-5xl text-yellow-600" />
                    </div>

                    {/* 404 */}
                    <h1 className="text-8xl font-black tracking-tight text-yellow-600 sm:text-9xl">
                        404
                    </h1>

                    {/* Title */}
                    <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Page Not Found
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                        Oops! The page you are looking for doesn't exist or may have
                        been moved. Don't worry, let's get you back on track.
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                        {/* Go Back */}
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition duration-200 hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
                        >
                            <FiArrowLeft size={17} />
                            Go Back
                        </button>

                        {/* Home */}
                        <Link
                            href="/"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-yellow-200 transition duration-200 hover:bg-yellow-500 sm:w-auto"
                        >
                            <FiHome size={17} />
                            Back to Home
                        </Link>

                        {/* Courses */}
                        <Link
                            href="/courses"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-6 py-3 text-sm font-semibold text-yellow-700 transition duration-200 hover:bg-yellow-100 sm:w-auto"
                        >
                            <FiSearch size={17} />
                            Browse Courses
                        </Link>
                    </div>

                    {/* Bottom message */}
                    <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <FiBookOpen size={16} />
                        <span>Keep learning. Keep growing.</span>
                    </div>
                </div>
            </div>
        </main>
    );
}


export default NotFound
