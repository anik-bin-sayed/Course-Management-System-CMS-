import { useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiPlayCircle,
  FiRadio,
  FiSave,
  FiVideo,
} from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import AppLink from "@/components/common/AppLink";
import { useGetCourseLessonsQuery } from "@/lib/features/lesson/lessonApi";
import { useGetLessonVideosQuery } from "@/lib/features/lesson/lessonVideoApi";
import { toast } from "sonner";

const tools = {
  "build-my-cv": {
    title: "Build My CV",
    eyebrow: "Career toolkit",
    description: "Create a clean, printable CV and keep a copy ready for your next opportunity.",
    icon: FiFileText,
  },
  rewards: {
    title: "Rewards",
    eyebrow: "Your achievements",
    description: "See the milestones you have earned as you make progress in your courses.",
    icon: FiAward,
  },
  resources: {
    title: "Resources",
    eyebrow: "Study library",
    description: "Find lesson notes and course materials from the courses you can access.",
    icon: FiBookOpen,
  },
  recordings: {
    title: "Recordings",
    eyebrow: "Watch again",
    description: "Revisit recorded lessons from your active and completed courses.",
    icon: FiPlayCircle,
  },
  "live-classes": {
    title: "Live Classes",
    eyebrow: "Learn together",
    description: "Check your enrolled courses for live class information and access links.",
    icon: FiRadio,
  },
  schedules: {
    title: "Schedules",
    eyebrow: "Course calendar",
    description: "Keep track of the start and end dates listed for your enrolled courses.",
    icon: FiCalendar,
  },
};

const cardClass = "rounded-xl border border-slate-200 bg-white shadow-sm";
const eligible = (enrollment) => ["active", "completed"].includes(enrollment.status);

function PageHeader({ config }) {
  const Icon = config.icon;
  return (
    <header className="mb-7 rounded-xl border border-emerald-900/10 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-sm sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-900 text-white">
          <Icon size={21} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{config.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{config.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{config.description}</p>
        </div>
      </div>
    </header>
  );
}

function EmptyPanel({ icon: Icon = FiBookOpen, title, description, action }) {
  return (
    <section className={`${cardClass} px-6 py-12 text-center`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={21} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
      {action}
    </section>
  );
}

function CourseLessons({ enrollment, mode }) {
  const { data: lessons = [], isLoading, isError } = useGetCourseLessonsQuery(
    { id: enrollment.course_id },
    { skip: !enrollment.course_id },
  );
  const hasLessonData = lessons.some((lesson) =>
    mode === "resources" ? lesson.description : lesson.video_count > 0,
  );

  if (isLoading) return <div className="h-24 animate-pulse rounded-xl bg-slate-200" aria-label="Loading course materials" />;
  if (isError) return <div className={`${cardClass} p-5 text-sm text-slate-600`}>Could not load materials for {enrollment.course.title}.</div>;
  if (!hasLessonData) return <div className={`${cardClass} p-5`}><h2 className="font-semibold text-slate-900">{enrollment.course.title}</h2><p className="mt-1 text-sm text-slate-500">{mode === "resources" ? "No lesson notes have been added yet." : "No recordings are available yet."}</p></div>;

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="font-semibold text-slate-900">{enrollment.course.title}</h2>
        <p className="mt-1 text-xs text-slate-500">{lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {lessons.map((lesson) => (
          <LessonMaterials key={lesson.id} lesson={lesson} course={enrollment.course} mode={mode} />
        ))}
      </div>
    </section>
  );
}

function LessonMaterials({ lesson, course, mode }) {
  const { data: videos = [] } = useGetLessonVideosQuery(
    { id: lesson.id },
    { skip: mode !== "recordings" || !lesson.video_count },
  );
  const visible = mode === "resources" ? Boolean(lesson.description?.trim()) : videos.length > 0;
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-800">{lesson.title}</h3>
        {mode === "resources" ? (
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{lesson.description}</p>
        ) : (
          <p className="mt-1 text-xs text-slate-500">{videos.length} {videos.length === 1 ? "recording" : "recordings"}</p>
        )}
      </div>
      {mode === "resources" ? (
        <AppLink href={`/dashboard/${encodeURIComponent(course.slug)}/${lesson.id}`} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
          Open lesson <FiExternalLink size={14} aria-hidden="true" />
        </AppLink>
      ) : (
        <div className="flex shrink-0 flex-wrap gap-2">
          {videos.map((video) => (
            <a key={video.id} href={video.video_url} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-md bg-emerald-50 px-3 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100">
              <FiPlayCircle size={15} aria-hidden="true" /> {video.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const initialCv = { headline: "", phone: "", location: "", summary: "", skills: "", experience: "", education: "" };

function CvBuilder({ profile, enrollments }) {
  const storageKey = `learnhub-cv-${profile?.id || "student"}`;
  const [cv, setCv] = useState(() => {
    try { return { ...initialCv, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; }
    catch { return initialCv; }
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(false); }, [cv]);
  const update = (event) => setCv((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem(storageKey, JSON.stringify(cv));
      setSaved(true);
      toast.success("CV saved on this device.");
    } catch {
      toast.error("Could not save your CV in this browser.");
    }
  };
  const print = () => {
    const cleanup = () => document.body.classList.remove("printing-cv");
    document.body.classList.add("printing-cv");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1500);
  };
  const inputClass = "mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
      <form onSubmit={save} className={`${cardClass} p-5 sm:p-6 print:hidden`}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="font-semibold text-slate-900">Your details</h2><p className="mt-1 text-xs text-slate-500">Your saved CV stays in this browser.</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={print} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FiDownload size={15} /> Print / PDF</button>
            <button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-emerald-900 px-3.5 text-sm font-semibold text-white hover:bg-emerald-800"><FiSave size={15} /> {saved ? "Saved" : "Save CV"}</button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Full name<input className={inputClass} value={profile?.name || ""} readOnly /></label>
          <label className={labelClass}>Email<input className={inputClass} value={profile?.email || ""} readOnly /></label>
          <label className={labelClass}>Professional headline<input name="headline" className={inputClass} value={cv.headline} onChange={update} placeholder="e.g. Frontend Developer" /></label>
          <label className={labelClass}>Phone<input name="phone" className={inputClass} value={cv.phone} onChange={update} placeholder="Your phone number" /></label>
          <label className={`${labelClass} sm:col-span-2`}>Location<input name="location" className={inputClass} value={cv.location} onChange={update} placeholder="City, Country" /></label>
          <label className={`${labelClass} sm:col-span-2`}>Professional summary<textarea name="summary" rows={3} className={inputClass} value={cv.summary} onChange={update} placeholder="A short introduction about your experience and goals" /></label>
          <label className={labelClass}>Skills<textarea name="skills" rows={4} className={inputClass} value={cv.skills} onChange={update} placeholder="Add one skill per line" /></label>
          <label className={labelClass}>Experience<textarea name="experience" rows={4} className={inputClass} value={cv.experience} onChange={update} placeholder="Role, company, dates, and achievements" /></label>
          <label className={`${labelClass} sm:col-span-2`}>Education<textarea name="education" rows={3} className={inputClass} value={cv.education} onChange={update} placeholder="Degree, institution, and dates" /></label>
        </div>
      </form>
      <style>{`@media print { body.printing-cv * { visibility: hidden !important; } body.printing-cv .cv-print-area, body.printing-cv .cv-print-area * { visibility: visible !important; } body.printing-cv .cv-print-area { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; min-height: 100vh !important; border: 0 !important; box-shadow: none !important; } }`}</style>
      <section className={`${cardClass} cv-print-area p-6 sm:p-8`} aria-label="CV preview">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">CV preview</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">{profile?.name || "Your name"}</h2>
        <p className="mt-1 text-sm font-medium text-emerald-900">{cv.headline || "Professional headline"}</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{[profile?.email, cv.phone, cv.location].filter(Boolean).join(" · ")}</p>
        <CvPreviewSection title="Profile" text={cv.summary} />
        <CvPreviewSection title="Skills" text={cv.skills} />
        <CvPreviewSection title="Experience" text={cv.experience} />
        <CvPreviewSection title="Education" text={cv.education} />
        {enrollments.filter(eligible).length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Professional development</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">{enrollments.filter(eligible).map((item) => <li key={item.id}>{item.course.title}</li>)}</ul>
          </div>
        )}
      </section>
    </div>
  );
}

function CvPreviewSection({ title, text }) {
  if (!text?.trim()) return null;
  return <div className="mt-6 border-t border-slate-100 pt-4"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{text}</p></div>;
}

function Rewards({ enrollments }) {
  const eligibleEnrollments = enrollments.filter(eligible);
  const completed = eligibleEnrollments.filter((item) => item.status === "completed");
  const lessonsDone = eligibleEnrollments.reduce((sum, item) => sum + (item.completed_lessons || 0), 0);
  const achievements = [
    { title: "First steps", description: "Joined your first course", icon: FiBookOpen, earned: eligibleEnrollments.length > 0 },
    { title: "Lesson explorer", description: "Completed your first lesson", icon: FiPlayCircle, earned: lessonsDone > 0 },
    { title: "Course graduate", description: "Completed a course", icon: FiAward, earned: completed.length > 0 },
  ];
  return (
    <>
      <section className={`${cardClass} mb-5 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}>
        <div><p className="text-sm text-slate-500">Achievements earned</p><p className="mt-1 text-3xl font-bold text-slate-950">{achievements.filter((item) => item.earned).length}<span className="text-base font-medium text-slate-400"> / {achievements.length}</span></p></div>
        <FiAward className="text-3xl text-amber-500" aria-hidden="true" />
      </section>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map(({ title, description, icon: Icon, earned }) => (
          <article key={title} className={`${cardClass} flex items-start gap-4 p-5 ${earned ? "" : "opacity-65"}`}>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${earned ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"}`}><Icon size={19} aria-hidden="true" /></span>
            <div><p className="font-semibold text-slate-900">{title}</p><p className="mt-1 text-sm leading-5 text-slate-600">{description}</p><p className={`mt-3 text-xs font-semibold ${earned ? "text-emerald-800" : "text-slate-400"}`}>{earned ? "Earned" : "Keep learning to unlock"}</p></div>
          </article>
        ))}
      </div>
    </>
  );
}

function CourseDates({ enrollments, mode }) {
  const rows = useMemo(() => enrollments.filter(eligible).map((item) => ({
    ...item,
    date: item.course.start_date || item.course.end_date,
  })).filter((item) => item.course.start_date || item.course.end_date).sort((a, b) => new Date(a.date) - new Date(b.date)), [enrollments]);
  if (mode === "live-classes") {
    return <EmptyPanel icon={FiVideo} title="No live class sessions are scheduled" description="Your enrolled courses do not have live session links or times yet. Course dates are available in Schedules." action={<AppLink href="/dashboard/schedules" className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">View schedules</AppLink>} />;
  }
  if (!rows.length) return <EmptyPanel icon={FiCalendar} title="No course dates yet" description="When an enrolled course has a start date, it will appear here." />;
  return (
    <div className="space-y-3">
      {rows.map((item) => (
        <article key={item.id} className={`${cardClass} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5`}>
          <div className="flex items-center gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800"><FiCalendar size={19} /></span><div><h2 className="font-semibold text-slate-900">{item.course.title}</h2><div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">{item.course.start_date && <span>Starts {new Date(item.course.start_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>}{item.course.end_date && <span>Ends {new Date(item.course.end_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>}</div></div></div>
          <div className="flex items-center gap-4 pl-[60px] sm:pl-0"><span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500"><FiClock /> {item.status}</span><AppLink href={`/dashboard/${encodeURIComponent(item.course.slug)}`} className="text-sm font-semibold text-emerald-800 hover:text-emerald-950">Open course <FiExternalLink className="ml-1 inline" size={13} /></AppLink></div>
        </article>
      ))}
    </div>
  );
}

export default function StudentDashboardToolsPage({ tool }) {
  const context = useOutletContext();
  const { profile, enrollments = [], isLoading } = context;
  const config = tools[tool];
  const eligibleCourses = enrollments.filter(eligible);
  if (!config) return null;
  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-9">
      <PageHeader config={config} />
      {tool === "build-my-cv" && <CvBuilder profile={profile} enrollments={enrollments} />}
      {tool === "rewards" && (isLoading ? <div className="h-40 animate-pulse rounded-xl bg-white" /> : <Rewards enrollments={enrollments} />)}
      {(tool === "resources" || tool === "recordings") && (isLoading ? <div className="h-40 animate-pulse rounded-xl bg-white" /> : eligibleCourses.length ? <div className="space-y-4">{eligibleCourses.map((enrollment) => <CourseLessons key={enrollment.id} enrollment={enrollment} mode={tool} />)}</div> : <EmptyPanel title="No courses available yet" description="Enroll in a course to see its study materials here." action={<AppLink href="/upcoming-course" className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-emerald-900 px-4 text-sm font-semibold text-white hover:bg-emerald-800">Explore courses</AppLink>} />)}
      {(tool === "schedules" || tool === "live-classes") && (isLoading ? <div className="h-40 animate-pulse rounded-xl bg-white" /> : <CourseDates enrollments={enrollments} mode={tool} />)}
    </main>
  );
}
