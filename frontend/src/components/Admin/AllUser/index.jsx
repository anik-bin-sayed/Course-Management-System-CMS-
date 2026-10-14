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
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Search Bar */}
      <Search
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        pagination={pagination}
        users={users}
        onSearch={onSearch}
      />

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
