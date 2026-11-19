import { lazy, Suspense, useState } from "react";

import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import Pagination from "./Pagination";
import UserTable from "./UserTable";
import Search from "./Search";

const RoleChangeModal = lazy(() => import("./RoleChangeModal"));

const AllUser = ({
  users = [],
  pagination = {},
  onSearch,
  onPageChange,
  onRoleChange,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      onPageChange?.(page);
    }
  };

  // Role change handler
  const handleRoleChange = (userId, newRole) => {
    onRoleChange?.(userId, newRole);
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  // Open role modal
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const { page = 1, total_pages = 1 } = pagination;

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl space-y-6 px-0 py-2 sm:mt-2 sm:space-y-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Administration</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">User management</h1>
          <p className="mt-1 text-sm text-slate-500">View accounts and manage access across LearnHub.</p>
        </div>
        <span className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm">
          {pagination.total || users.length} accounts
        </span>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        pagination={pagination}
        users={users}
        onSearch={onSearch}
      />
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        openRoleModal={openRoleModal}
      />

      {/* Pagination Controls */}
      <Pagination page={page} goToPage={goToPage} total_pages={total_pages} />

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <Suspense
          fallback={
            <LoadingFallback label="Loading dialog..." variant="modal" />
          }
        >
          <RoleChangeModal
            selectedUser={selectedUser}
            setShowRoleModal={setShowRoleModal}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AllUser;
