import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export const authService = {
  /**
   * Logs in the admin user using just a password.
   * Maps to the internal admin email.
   */
  async loginAdmin(password: string) {
    const supabase = await createClient();
    
    // Internal generic admin email
    const email = "admin@abtournaments.local";

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Checks if there is an active session
   */
  async getSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },

  /**
   * Logs out the current user
   */
  async logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Checks if the currently authenticated user is an admin
   */
  async isAdmin() {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log("isAdmin: No valid user found from getUser(). Error:", error?.message);
        return false;
      }

      // Lazy import to avoid circular dependency issues if any
      const { userService } = await import('./user.service');
      
      console.log(`isAdmin check for user ID: ${user.id}`);
      
      const profile = await userService.getUserProfile(user.id);
      
      console.log("isAdmin: User profile role:", profile.role);
      return profile.role === 'admin';
    } catch (e: any) {
      console.error("isAdmin Error:", e);
      return false;
    }
  }
};
