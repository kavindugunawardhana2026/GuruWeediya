"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

// Send a message
export async function sendMessage(receiverId: string, content: string, jobId?: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const supabase = await createClient();

  const insertData: any = {
    sender_id: user.id,
    receiver_id: receiverId,
    content: content,
  };
  if (jobId) {
    insertData.job_id = jobId;
  }

  const { error } = await (supabase as any).from("messages").insert(insertData);

  if (error) return { error: error.message };

  revalidatePath("/messages");
  return { success: true };
}

// Get conversations list (grouped by user)
// Since Supabase doesn't support complex grouping over RPC easily without a custom function,
// we will fetch all messages for the current user and group them in JS.
export async function getConversations() {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { data: messages, error } = await (supabase as any)
    .from("messages")
    .select(`
      *,
      sender:users!sender_id (id, role),
      receiver:users!receiver_id (id, role)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  
  // We need to fetch profiles for the other users to display names
  // Find unique other user IDs
  const otherUserIds = new Set<string>();
  messages?.forEach((m: any) => {
    if (m.sender_id !== user.id) otherUserIds.add(m.sender_id);
    if (m.receiver_id !== user.id) otherUserIds.add(m.receiver_id);
  });

  const otherUsers = Array.from(otherUserIds);
  let profiles: Record<string, any> = {};

  if (otherUsers.length > 0) {
    // Fetch teacher profiles
    const { data: teachers } = await (supabase as any)
      .from("teachers")
      .select("user_id, full_name, profile_image_url")
      .in("user_id", otherUsers);
      
    // Fetch institute profiles
    const { data: institutes } = await (supabase as any)
      .from("institutes")
      .select("user_id, institute_name, logo_url")
      .in("user_id", otherUsers);
      
    teachers?.forEach((t: any) => {
      profiles[t.user_id] = { name: t.full_name, avatar: t.profile_image_url, role: 'teacher' };
    });
    institutes?.forEach((i: any) => {
      profiles[i.user_id] = { name: i.institute_name, avatar: i.logo_url, role: 'institute' };
    });
  }

  return { messages, profiles };
}

// Mark messages as read
export async function markAsRead(otherUserId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user.id)
    .eq("sender_id", otherUserId)
    .eq("is_read", false);

  if (error) return { error: error.message };

  revalidatePath("/messages");
  return { success: true };
}
