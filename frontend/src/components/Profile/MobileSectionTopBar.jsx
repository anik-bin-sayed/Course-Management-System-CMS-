import React from "react";
import { IoIosLogOut, IoMdArrowBack } from "react-icons/io";
import { useRouter } from "@/lib/navigation";
import {
  authApi,
  useLogoutUserMutation,
} from "../../lib/features/auth/authApi";
import { useDispatch } from "react-redux";

const MobileSectionTopBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  //   redux
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(authApi.util.resetApiState());
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <IoMdArrowBack />
        Back
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
      >
        Logout
        <IoIosLogOut className="font-medium" />
      </button>
    </div>
  );
};

export default MobileSectionTopBar;
