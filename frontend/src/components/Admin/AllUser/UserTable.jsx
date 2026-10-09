import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import UserTableLoader from "./UserTableLoader";

const UserTable = ({ users, isLoading, openRoleModal }) => {
  if (isLoading) return <UserTableLoader />;
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email / Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 relative">
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
                      className="text-gray-600 hover:bg-yellow-400 border border-gray-200 px-2 py-1 rounded-md"
                    >
                      Profile
                    </Link>

                    {/* Change Role */}
                    <button
                      onClick={() => openRoleModal(user)}
                      className="text-gray-600 hover:bg-yellow-400 border border-gray-200 px-2 py-1 rounded-md"
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
