import { useParams } from "@/lib/navigation";
import UserProfile from "@/components/UserProfile/UserProfile";

export default function UserDetailsPage() {
  const { userId } = useParams();
  return <UserProfile userId={userId} />;
}
