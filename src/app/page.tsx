import { fetchUserData } from "@/api/user";
import UserList from "@/components/UserList";
import { Skeleton } from "@chakra-ui/react";
import { Suspense } from "react";

export default async function Home() {
  const users = fetchUserData();
  return (
    <Suspense fallback={<Skeleton h={"80"}></Skeleton>}>
      <UserList users={users} />
    </Suspense>
  );
}
