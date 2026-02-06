import type { Metadata } from "next";
import { features } from "@/lib/features";
import {
  DEFAULT_FEATURES,
  FEATURE_ENV_KEYS,
  checkFeatureDependencies,
} from "@matrx/shared";
import type { FeatureFlags } from "@matrx/shared";

export const metadata: Metadata = {
  title: "Settings",
};

/** Environment variables to check for configuration status. */
const ENV_CHECKS = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    label: "Supabase URL",
    category: "Supabase",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    label: "Supabase Anon Key",
    category: "Supabase",
  },
  {
    name: "STRIPE_SECRET_KEY",
    label: "Stripe Secret Key",
    category: "Stripe",
  },
  {
    name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    label: "Stripe Publishable Key",
    category: "Stripe",
  },
  {
    name: "MATRX_AI_BACKEND_URL",
    label: "AI Backend URL",
    category: "AI",
  },
  {
    name: "MATRX_AI_API_KEY",
    label: "AI API Key",
    category: "AI",
  },
  {
    name: "GITHUB_WEBHOOK_SECRET",
    label: "GitHub Webhook Secret",
    category: "Webhooks",
  },
  {
    name: "VERCEL_WEBHOOK_SECRET",
    label: "Vercel Webhook Secret",
    category: "Webhooks",
  },
  {
    name: "NEXT_PUBLIC_SITE_URL",
    label: "Site URL",
    category: "App",
  },
] as const;

function FeatureStatusIcon({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return (
      <svg
        className="h-5 w-5 text-success"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-5 w-5 text-foreground-muted"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function EnvStatusDot({ configured }: { configured: boolean }) {
  if (configured) {
    return (
      <span className="inline-block h-2 w-2 rounded-full bg-success" />
    );
  }

  return (
    <span className="inline-block h-2 w-2 rounded-full bg-foreground-muted" />
  );
}

/**
 * Settings Page
 *
 * Displays feature flag status, environment variable configuration,
 * and application version information.
 */
export default function SettingsPage() {
  const featureKeys = Object.keys(features) as Array<keyof FeatureFlags>;

  // Build env check results
  const envResults = ENV_CHECKS.map((check) => ({
    ...check,
    configured: !!process.env[check.name],
  }));

  // Group env results by category
  const envByCategory = envResults.reduce<
    Record<string, typeof envResults>
  >((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Count feature stats
  const enabledCount = featureKeys.filter((k) => features[k]).length;
  const totalCount = featureKeys.length;

  // Count env stats
  const configuredCount = envResults.filter((e) => e.configured).length;
  const totalEnvCount = envResults.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-foreground-secondary">
          System configuration and feature flags.
        </p>
      </div>

      {/* App version info */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Application Info
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Platform
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Next.js 16.1
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Environment
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {process.env.NODE_ENV ?? "development"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">
              Build
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {process.env.NEXT_PUBLIC_BUILD_ID ?? "local"}
            </p>
          </div>
        </div>
      </div>

      {/* Feature flags */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Feature Flags
          </h2>
          <span className="text-sm text-foreground-muted">
            {enabledCount} of {totalCount} enabled
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground-secondary">
          Features are controlled via environment variables. Set{" "}
          <code className="rounded bg-background-tertiary px-1 py-0.5 font-mono text-xs">
            NEXT_PUBLIC_FEATURE_*=true
          </code>{" "}
          to enable.
        </p>

        <div className="mt-4 divide-y divide-border">
          {featureKeys.map((key) => {
            const isEnabled = features[key];
            const isDefault = DEFAULT_FEATURES[key] === isEnabled;
            const envKey = FEATURE_ENV_KEYS[key];
            const missingDeps = checkFeatureDependencies(key, process.env as Record<string, string | undefined>);

            return (
              <div
                key={key}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <FeatureStatusIcon enabled={isEnabled} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {key}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {envKey}
                      {isDefault && (
                        <span className="ml-2 text-foreground-muted">
                          (default)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {missingDeps.length > 0 && isEnabled && (
                    <span className="rounded-full bg-warning-light px-2 py-0.5 text-xs font-medium text-warning">
                      {missingDeps.length} missing dep{missingDeps.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isEnabled
                        ? "bg-success-light text-success"
                        : "bg-background-secondary text-foreground-muted"
                    }`}
                  >
                    {isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environment variables */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Environment Variables
          </h2>
          <span className="text-sm text-foreground-muted">
            {configuredCount} of {totalEnvCount} configured
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground-secondary">
          Required environment variables and their configuration status.
        </p>

        <div className="mt-4 space-y-6">
          {Object.entries(envByCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                {category}
              </h3>
              <div className="mt-2 divide-y divide-border">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <EnvStatusDot configured={item.configured} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="font-mono text-xs text-foreground-muted">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.configured
                          ? "text-success"
                          : "text-foreground-muted"
                      }`}
                    >
                      {item.configured ? "Configured" : "Not set"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
