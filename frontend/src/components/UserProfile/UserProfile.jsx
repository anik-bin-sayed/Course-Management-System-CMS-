"use client";

import { useUserProfileQuery } from "../../lib/features/profile/profileApi";
import { useState } from "react";
import ProfileNavbar from "../Profile/ProfileNavbar";
import MobileSectionTopBar from "../Profile/MobileSectionTopBar";
import Image from "@/components/common/AppImage";
import CountryFlag from "../Profile/ui/CountryFlag";

import {
  FaCheck,
  FaCopy,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaUser,
  FaVenusMars,
} from "react-icons/fa6";

import {
  FaBirthdayCake,
  FaCalendarAlt,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";

import Loader from "../../utils/Loader";
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import UserProfileLoader from "../Profile/UserProfileLoader";
import InfoCard from "../Profile/InfoCard";
import PreviewImage from "../Profile/PreviewImage";

const UserProfile = ({ userId }) => {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: profile, isLoading } = useUserProfileQuery({
    user_id: userId,
  });

  const { data: currentUser, isLoading: currentUserLoading } =
    useGetProfileQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(profile?.id);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (currentUserLoading || isLoading) {
    return <UserProfileLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <ProfileNavbar profile={currentUser} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <MobileSectionTopBar />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* LEFT PROFILE CARD */}

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="px-6 pb-7 pt-8">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="group relative cursor-pointer"
                  >
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-1 ring-slate-200">
                      <Image
                        src={profile?.avatar || "/images/default.jpg"}
                        alt={`${profile?.name || "User"} profile`}
                        fill
                        sizes="128px"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/30">
                        <span className="text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
                          View
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Name */}
                  <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                    {profile?.name}
                  </h1>

                  {/* Country */}
                  <div className="mt-2">
                    <CountryFlag profile={profile} />
                  </div>

                  {/* Email */}
                  <p className="mt-2 max-w-full truncate px-2 text-sm text-slate-500">
                    {profile?.email}
                  </p>

                  {/* Role */}
                  <span className="mt-4 inline-flex items-center rounded-full bg-yellow-50 px-4 py-1.5 text-xs font-semibold capitalize text-yellow-700 ring-1 ring-yellow-200">
                    {profile?.role}
                  </span>
                </div>

                {/* Bio */}
                {profile?.bio && (
                  <div className="mt-7 border-t border-slate-100 pt-6">
                    <p className="text-center text-sm leading-6 text-slate-600">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50">
                <div className="px-4 py-4 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    Verification
                  </p>

                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    {profile?.is_verified ? (
                      <>
                        <FaCheckCircle className="text-emerald-500" size={13} />

                        <span className="text-sm font-semibold text-emerald-600">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-slate-400" size={13} />

                        <span className="text-sm font-semibold text-slate-500">
                          Unverified
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="border-l border-slate-200 px-4 py-4 text-center">
                  <p className="text-xs font-medium text-slate-500">Joined</p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT INFORMATION CARD */}

          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Account Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Personal and account details
                    </p>
                  </div>

                  {/* Copy ID */}
                  <button
                    type="button"
                    onClick={copyId}
                    className="flex max-w-full cursor-pointer items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm transition hover:border-slate-300 hover:bg-slate-100 sm:self-auto"
                  >
                    <span className="max-w-44 truncate font-medium text-slate-600">
                      ID: {profile?.id}
                    </span>

                    {copied ? (
                      <FaCheck
                        className="shrink-0 text-emerald-500"
                        size={13}
                      />
                    ) : (
                      <FaCopy className="shrink-0 text-slate-400" size={13} />
                    )}
                  </button>
                </div>
              </div>

              {/* Information Grid */}
              <div className="p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<FaUser />}
                    title="Name"
                    value={profile?.name}
                  />

                  <InfoCard
                    icon={<FaEnvelope />}
                    title="Email"
                    value={profile?.email}
                  />

                  <InfoCard
                    icon={<FaPhoneAlt />}
                    title="Phone"
                    value={profile?.phone || "-"}
                  />

                  <InfoCard
                    icon={<FaVenusMars />}
                    title="Gender"
                    value={profile?.gender || "-"}
                  />

                  <InfoCard
                    icon={<FaBirthdayCake />}
                    title="Date of Birth"
                    value={profile?.date_of_birth || "-"}
                  />

                  <InfoCard
                    icon={<FaMapMarkerAlt />}
                    title="Address"
                    value={profile?.address || "-"}
                  />

                  <InfoCard
                    icon={<FaGlobe />}
                    title="Country"
                    value={profile?.country || "-"}
                  />

                  <InfoCard
                    icon={<FaGlobe />}
                    title="Website"
                    value={profile?.website || "-"}
                  />

                  <InfoCard
                    icon={<FaGithub />}
                    title="GitHub"
                    value={profile?.github || "-"}
                  />

                  <InfoCard
                    icon={<FaLinkedin />}
                    title="LinkedIn"
                    value={profile?.linkedin || "-"}
                  />

                  <InfoCard
                    icon={<FaShieldAlt />}
                    title="Role"
                    value={profile?.role || "-"}
                  />

                  <InfoCard
                    icon={
                      profile?.is_verified ? (
                        <FaCheckCircle className="text-emerald-500" />
                      ) : (
                        <FaTimesCircle className="text-slate-400" />
                      )
                    }
                    title="Verification"
                    value={profile?.is_verified ? "Verified" : "Not Verified"}
                  />

                  <InfoCard
                    icon={<FaCalendarAlt />}
                    title="Joined"
                    value={
                      profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "-"
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* IMAGE PREVIEW MODAL */}

      {previewOpen && (
        <PreviewImage setPreviewOpen={setPreviewOpen} profile={profile} />
      )}
    </div>
  );
};

export default UserProfile;
