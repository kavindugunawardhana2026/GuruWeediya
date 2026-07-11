import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/actions";
import { getConversations } from "@/lib/actions/messages";
import MessagesClient from "./MessagesClient";

export const metadata = {
  title: "Messages | GuruWeediya.lk",
};

export default async function MessagesPage(props: { searchParams: Promise<{ user?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { messages, profiles, error } = await getConversations();

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading messages: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 h-[calc(100vh-80px)]">
      <MessagesClient 
        currentUserId={user.id} 
        initialMessages={messages || []} 
        profiles={profiles || {}} 
        selectedUserId={searchParams.user}
      />
    </div>
  );
}
