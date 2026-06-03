import { create } from "zustand";
import { fetchCurrentUser } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      const res = await fetchCurrentUser();
      set({ 
        user: res.data.data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err) {
      console.error("Auth fetch failed:", err);
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
