export const apiClient = {
  auth: {
    async loginAdmin(password: string) {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    },

    async logout() {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");
      return data;
    },

    async getSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch session");
      return data.session;
    }
  },

  dashboard: {
    async getStats() {
      const res = await fetch("/api/dashboard/stats", {
        cache: "no-store"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard stats");
      return data.stats;
    }
  },

  competitions: {
    async get(limit: number = 10, offset: number = 0, search?: string) {
      let url = `/api/competitions?limit=${limit}&offset=${offset}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url, {
        cache: "no-store"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch competitions");
      return data.competitions;
    },
    
    async getById(id: string) {
      const res = await fetch(`/api/competitions/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch competition");
      return data.competition;
    },
    
    async create(competitionData: any) {
      const res = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competitionData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create competition");
      return data.competition;
    },
    
    async update(id: string, competitionData: any) {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(competitionData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update competition");
      return data.competition;
    },
    
    async delete(id: string) {
      const res = await fetch(`/api/competitions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete competition");
      return data;
    }
  },

  registrations: {
    async create(registrationData: any) {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create registration");
      return data;
    },

    async verify(registrationId: string, otpCode: string) {
      const res = await fetch("/api/registrations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
      return data;
    },

    async get(limit: number = 10, offset: number = 0, competitionId?: string, search?: string) {
      let url = `/api/registrations?limit=${limit}&offset=${offset}`;
      if (competitionId) {
        url += `&competition_id=${competitionId}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url, {
        cache: "no-store"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch registrations");
      return data.registrations;
    },

    async getById(id: string) {
      const res = await fetch(`/api/registrations/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch registration");
      return data.registration;
    }
  },

  sponsors: {
    async get(limit: number = 10, offset: number = 0) {
      const res = await fetch(`/api/sponsors?limit=${limit}&offset=${offset}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch sponsors");
      return data.sponsors;
    },
    async getById(id: string) {
      const res = await fetch(`/api/sponsors/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch sponsor");
      return data.sponsor;
    },
    async create(sponsorData: any) {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create sponsor");
      return data.sponsor;
    },
    async update(id: string, sponsorData: any) {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update sponsor");
      return data.sponsor;
    },
    async delete(id: string) {
      const res = await fetch(`/api/sponsors/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete sponsor");
      return data;
    }
  },

  gallery: {
    async get(limit: number = 10, offset: number = 0) {
      const res = await fetch(`/api/gallery?limit=${limit}&offset=${offset}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch gallery");
      return data.gallery;
    },
    async getById(id: string) {
      const res = await fetch(`/api/gallery/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch gallery item");
      return data.item;
    },
    async create(galleryData: any) {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create gallery item");
      return data.item;
    },
    async update(id: string, galleryData: any) {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(galleryData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update gallery item");
      return data.item;
    },
    async delete(id: string) {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete gallery item");
      return data;
    }
  }
};
