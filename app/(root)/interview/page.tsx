import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  
  const profileImageUrl = user?.profileURL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/${user.profileURL}`
  : '/user-avatar.png';
  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        profileImage= {profileImageUrl}
        type="generate"
      />
    </>
  );
};

export default Page;