import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import UserTableLoader from "./UserTableLoader";

const UserTable = ({ users, isLoading, openRoleModal }) => {
  if (isLoading) return <UserTableLoader />;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100 bg-white">
        <thead className="bg-slate-50/80">
          <tr>
            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              User
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Email / Phone
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Role
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-slate-50/80">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                      <Image
                        src={user.avatar || "/images/default.jpg"}
                        alt={user.name || "User"}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username || "no-username"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.email || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.phone || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    {/* View Profile */}
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Profile
                    </Link>

                    {/* Change Role */}
                    <button
                      onClick={() => openRoleModal(user)}
                      className="rounded-lg bg-[#173c2d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#24563e]"
                    >
                      Change Role
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
