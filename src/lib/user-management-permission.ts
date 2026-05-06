import type { createClient } from "@/utils/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface UserManagementCaller {
  id: string | null;
  name: string | null;
  roleName: string | null;
  hasPermission: boolean;
}

interface CallerRole {
  name: string;
  menu_access: string[];
}

export async function getUserManagementCaller(
  supabase: ServerSupabaseClient,
  authId: string
): Promise<UserManagementCaller> {
  const { data: callerData } = await supabase
    .from("users")
    .select("id, name, is_primary, roles(name, menu_access)")
    .eq("auth_id", authId)
    .single();

  const callerRolesData = callerData?.roles as unknown;
  const callerRole = (
    Array.isArray(callerRolesData) ? callerRolesData[0] : callerRolesData
  ) as CallerRole | null;

  return {
    id: callerData?.id ?? null,
    name: callerData?.name ?? null,
    roleName: callerRole?.name ?? null,
    hasPermission: callerData?.is_primary || callerRole?.menu_access?.includes("user-management") || false,
  };
}
