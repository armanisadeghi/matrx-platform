import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Users",
};

/** Placeholder user data for when auth/Supabase is not configured. */
const PLACEHOLDER_USERS = [
  {
    id: "1",
    full_name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    created_at: "2025-11-15T10:00:00Z",
  },
  {
    id: "2",
    full_name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    status: "active",
    created_at: "2025-12-01T14:30:00Z",
  },
  {
    id: "3",
    full_name: "Carol Davis",
    email: "carol@example.com",
    role: "user",
    status: "inactive",
    created_at: "2026-01-10T09:15:00Z",
  },
  {
    id: "4",
    full_name: "Dan Wilson",
    email: "dan@example.com",
    role: "editor",
    status: "active",
    created_at: "2026-01-20T16:45:00Z",
  },
  {
    id: "5",
    full_name: "Eve Martinez",
    email: "eve@example.com",
    role: "user",
    status: "pending",
    created_at: "2026-02-03T11:00:00Z",
  },
];

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

/**
 * Fetch users from Supabase, or return placeholder data if auth is disabled.
 */
async function getUsers(): Promise<UserRow[]> {
  if (!features.auth) {
    return PLACEHOLDER_USERS;
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Attempt to query the users/profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      // Table may not exist yet — fall back to placeholder data
      return PLACEHOLDER_USERS;
    }

    return data as UserRow[];
  } catch {
    // Supabase not configured — fall back to placeholder data
    return PLACEHOLDER_USERS;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-success-light text-success",
    inactive: "bg-background-tertiary text-foreground-muted",
    pending: "bg-warning-light text-warning",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-primary-container text-on-primary-container",
    owner: "bg-primary-container text-on-primary-container",
    editor: "bg-info-light text-info",
    user: "bg-background-secondary text-foreground-secondary",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[role] ?? "bg-background-secondary text-foreground-secondary"}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

/**
 * Users Management Page
 *
 * Server Component that fetches user data from Supabase.
 * Falls back to placeholder data if auth is disabled or Supabase is not configured.
 */
export default async function UsersPage() {
  const users = await getUsers();
  const isPlaceholder = !features.auth;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-foreground-secondary">
            Manage user accounts and roles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground-muted">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Placeholder notice */}
      {isPlaceholder && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            Auth feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the auth feature flag and configure Supabase to manage real users.
          </p>
        </div>
      )}

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background-secondary">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-background-secondary"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                    {user.full_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground-secondary">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-foreground-muted">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
