"use client";

import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import ProfileNavbar from "./ProfileNavbar";
import {
  FaArrowLeftLong,
  FaGithub,
  FaGlobe,
  FaLinkedin,
} from "react-icons/fa6";
import GenderSelect from "./ui/GenderSelect";
import Loader from "../../utils/Loader";
import { useUpdateProfileInfoMutation } from "../../lib/features/profile/profileApi";
import CountrySelect from "./ui/CountrySelect ";

// demo

const initialFormData = {
  name: "",
  bio: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  gender: "",
  date_of_birth: "",
  website: "",
  github: "",
  linkedin: "",
};

const EditProfile = () => {
  // Local form state
  const [formData, setFormData] = useState(initialFormData);

  // router
  const router = useRouter();

  // Redux
  const {
    data: profile,
    isLoading: isFetching,
    error: fetchError,
  } = useGetProfileQuery();
  const [
    updateProfileInfo,
    { isLoading: isUpdating, error: updateError, isSuccess },
  ] = useUpdateProfileInfoMutation();

  // Populate form when profile data arrives
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        gender: profile.gender || "",
        date_of_birth: profile.date_of_birth
          ? new Date(profile.date_of_birth).toISOString().split("T")[0]
          : "",
        website: profile.website || "",
        github: profile.github || "",
        linkedin: profile.linkedin || "",
      });
    }
  }, [profile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      await updateProfileInfo({
        formData: payload,
        user_id: profile.id,
      }).unwrap();
      router.push("/profile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (isFetching) <Loader />;

  if (fetchError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="">
      <ProfileNavbar profile={profile} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-100 focus:outline-none  gap-2 cursor-pointer"
          >
            <FaArrowLeftLong />
            Back
          </button>
        </div>

        {/* main section */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            <p className="text-sm text-gray-500">
              Update your personal information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email – read‑only */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={profile?.email || ""}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-not-allowed px-4 py-2 "
              />
              <p className="mt-1 text-xs  text-gray-400">
                Email cannot be changed
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm  px-4 py-2 "
              />
            </div>

            {/* Bio */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>

                <span
                  className={`text-xs ${
                    formData.bio.length >= 200
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formData.bio.length}/200
                </span>
              </div>

              <textarea
                id="bio"
                name="bio"
                rows={4}
                maxLength={200}
                value={formData.bio}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Tell us about yourself"
              />

              <p className="mt-1 text-xs text-gray-500">
                Maximum 200 characters.
              </p>
            </div>

            {/* Phone & Address */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm  px-4 py-2 "
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>
              <CountrySelect
                value={formData.country}
                onChange={(country) =>
                  setFormData((prev) => ({
                    ...prev,
                    country,
                  }))
                }
                required
              />
            </div>

            {/* Gender & Date of Birth */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <GenderSelect
                value={formData.gender}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value,
                  }))
                }
              />

              <div>
                <label
                  htmlFor="date_of_birth"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>

                <div className="relative">
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="
        h-12
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        pr-12
        text-gray-700
        outline-none
        transition-all
        duration-200
       
      "
                  />
                </div>
              </div>
            </div>

            {/* Website, GitHub, LinkedIn */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Website
                </label>

                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 "
                  />
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label
                  htmlFor="github"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  GitHub
                </label>

                <div className="relative">
                  <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 "
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label
                  htmlFor="linkedin"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  LinkedIn
                </label>

                <div className="relative">
                  <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 "
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50  "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 border border-transparent rounded-md shadow-sm hover:bg-yellow-500 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
