import Image from "@/components/common/AppImage";
import { FaTimes } from "react-icons/fa";

const PreviewImage = ({ setPreviewOpen, profile }) => {
  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={() => setPreviewOpen(false)}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setPreviewOpen(false)}
        className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100"
        aria-label="Close image preview"
      >
        <FaTimes size={18} />
      </button>

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={profile?.avatar || "/images/default.jpg"}
          alt={`${profile?.name || "User"} profile`}
          width={800}
          height={800}
          className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </div>
  );
};

export default PreviewImage;
