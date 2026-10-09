import { useSearchParams } from "@/lib/navigation";
import { useRouter } from "@/lib/navigation";
import AllUser from "@/components/Admin/AllUser";
import { useAllUsersQuery } from "@/lib/features/profile/profileApi";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const { data, isLoading, isError, refetch } = useAllUsersQuery({
    page,
    limit: 30,
    search,
  });

  const updateQuery = (nextSearch, nextPage) => {
    const params = new URLSearchParams(searchParams);
    if (nextSearch) params.set("search", nextSearch);
    else params.delete("search");
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    router.replace(`?${params.toString()}`);
  };

  const handleRoleChange = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (isError) return <div>Error occurred while fetching users.</div>;

  return (
    <AllUser
      users={data?.users || []}
      pagination={data?.pagination || {}}
      onSearch={(term) => updateQuery(term, 1)}
      onPageChange={(nextPage) => updateQuery(search, nextPage)}
      onRoleChange={handleRoleChange}
      isLoading={isLoading}
    />
  );
}
