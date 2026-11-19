// React
import { useRef, useState } from "react";

// Icons
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCheck,
  FaCopy,
  FaCamera,
  FaExternalLinkAlt,
  FaEdit,
} from "react-icons/fa";

// Local
import InfoCard from "./InfoCard";
import PreviewImage from "./PreviewImage";
import CountryFlag from "./ui/CountryFlag";
import ProfileNavbar from "./ProfileNavbar";
import ProfileLoader from "./ProfileLoader";
import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";
import MobileSectionTopBar from "./MobileSectionTopBar";

// Redux
import { useGetProfileQuery } from "../../lib/features/auth/authApi";
import { useUploadAvatarMutation } from "../../lib/features/profile/profileApi";

const Profile = () => {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Redux
  const {
    data: profile,
    refetch,
    isLoading,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation();

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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      await refetch();
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      e.target.value = "";
    }
  };

  if (isLoading) return <ProfileLoader />;

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <ProfileNavbar profile={profile} />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <MobileSectionTopBar />

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Account</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Your profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information and account details.</p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-6">
          {/*  LEFT PROFILE CARD  */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Profile Header */}
              <div className="relative px-5 pb-6 pt-0 sm:px-6">
                <div className="-mx-5 h-24 bg-[#173c2d] sm:-mx-6 sm:h-28" />
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative -mt-14">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="group relative block cursor-pointer"
                    >
                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200 sm:h-32 sm:w-32">
                        <Image
                          src={profile?.avatar || "/images/default.jpg"}
                          alt={`${profile?.name || "User"} profile`}
                          fill
                          sizes="128px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                          <span className="text-white opacity-0 transition group-hover:opacity-100">
                            View
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Upload Loader */}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-white border-t-transparent" />
                      </div>
                    )}

                    {/* Camera */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      aria-label="Change profile picture"
                      className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-yellow-400 text-slate-900 shadow-sm transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <FaCamera size={15} />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Name */}
                  <h2 className="mt-4 max-w-full truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {profile?.name || "Your name"}
                  </h2>

                  {/* Country */}
                  <div className="mt-2">
                    <CountryFlag profile={profile} />
                  </div>

                  {/* Email */}
                  <p className="mt-2 max-w-full truncate px-2 text-sm text-slate-500">
                    {profile?.email}
                  </p>

                  {/* Role */}
                  <span className="mt-3 inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-800 ring-1 ring-emerald-100">
                    {profile?.role}
                  </span>

                  {/* Edit Button */}
                  <Link
                    href="/profile/edit"
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24563e]"
                  >
                    <FaEdit size={13} />
                    Edit Profile
                  </Link>
                </div>

                {/* Bio */}
                {profile?.bio && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-center text-sm leading-6 text-slate-600">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50/80">
                <div className="px-4 py-4 text-center">
                  <p className="text-xs font-medium text-slate-500">Status</p>

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
                  <p className="text-xs font-medium text-slate-500">
                    Member Since
                  </p>

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

          {/*  RIGHT CONTENT  */}
          <section className="min-w-0">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Personal information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your contact, social and account details.
                    </p>
                  </div>

                  {/* Copy ID */}
                  <button
                    type="button"
                    onClick={copyId}
                    className="group flex max-w-full items-center gap-2 self-start rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm transition hover:border-slate-300 hover:bg-slate-100 sm:self-auto"
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
                      <FaCopy
                        className="shrink-0 text-slate-400 transition group-hover:text-slate-600"
                        size={13}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Information */}
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
                    value={
                      profile?.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-1.5 truncate text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                          <span className="truncate">{profile.website}</span>
                          <FaExternalLinkAlt className="shrink-0" size={10} />
                        </a>
                      ) : (
                        "-"
                      )
                    }
                  />

                  <InfoCard
                    icon={<FaGithub />}
                    title="GitHub"
                    value={
                      profile?.github ? (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-1.5 truncate text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                          <span className="truncate">{profile.github}</span>
                          <FaExternalLinkAlt className="shrink-0" size={10} />
                        </a>
                      ) : (
                        "-"
                      )
                    }
                  />

                  <InfoCard
                    icon={<FaLinkedin />}
                    title="LinkedIn"
                    value={
                      profile?.linkedin ? (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-1.5 truncate text-yellow-600 hover:text-yellow-700 hover:underline"
                        >
                          <span className="truncate">{profile.linkedin}</span>
                          <FaExternalLinkAlt className="shrink-0" size={10} />
                        </a>
                      ) : (
                        "-"
                      )
                    }
                  />

                  <InfoCard
                    icon={<FaShieldAlt />}
                    title="Role"
                    value={
                      <span className="capitalize">{profile?.role || "-"}</span>
                    }
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
                    value={
                      profile?.is_verified ? (
                        <span className="font-medium text-emerald-600">
                          Verified
                        </span>
                      ) : (
                        <span className="text-slate-500">Not Verified</span>
                      )
                    }
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

      {/*  IMAGE PREVIEW MODAL  */}
      {previewOpen && (
        <PreviewImage setPreviewOpen={setPreviewOpen} profile={profile} />
      )}
    </div>
  );
};

export default Profile;
