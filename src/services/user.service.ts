import { createServiceRoleClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
}

export const userService = {
  /**
   * Fetch a user profile by their auth ID
   */
  async getUserProfile(userId: string) {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("User profile not found");
    }

    return data as UserProfile;
  }
};
