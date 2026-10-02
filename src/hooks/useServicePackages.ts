import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useServicePackages() {
  return useQuery({
    queryKey: ["service-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_packages")
        .select("*, service_package_features(feature_text, sort_order)")
        .eq("is_active", true)
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

