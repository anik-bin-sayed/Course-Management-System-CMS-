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
    <div className="flex items-center justify-between mb-4 lg:hidden">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-gray-300 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:gap-1 transition-all duration-300"
      >
        <IoMdArrowBack />
        Back
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
        <IoIosLogOut className="font-medium" />
      </button>
    </div>
  );
};

export default MobileSectionTopBar;
