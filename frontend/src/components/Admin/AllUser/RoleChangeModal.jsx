// React
import { useState } from "react";

// Third Party
import { toast } from "sonner";

// Icons
import { FaUserShield, FaChevronDown } from "react-icons/fa";

// Redux
import { useUserRoleChangeMutation } from "../../../lib/features/profile/profileApi";

const RoleChangeModal = ({ selectedUser, setShowRoleModal }) => {
  const [role, setRole] = useState(selectedUser?.role || "student");

  const [userRoleChange, { isLoading }] = useUserRoleChangeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userRoleChange({
        user_id: selectedUser.id,
        formData: {
          role,
        },
      }).unwrap();
    } catch (error) {
      toast.error(error?.data?.detail || "Failed to update role");
    } finally {
      setShowRoleModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <FaUserShield size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Change User Role
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Update the role of{" "}
                <span className="font-medium text-gray-700">
                  {selectedUser?.name || selectedUser?.email}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form className="px-6 py-6" onSubmit={handleSubmit}>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select Role
          </label>

          <div className="relative">
            <select
              id="role"
              value={role}
              disabled={isLoading}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>

            <FaChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
          </div>

          {/* Selected Role Preview */}
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Selected Role
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
              {role}
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowRoleModal(false)}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-medium text-black shadow-sm transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating" : "Update Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleChangeModal;
