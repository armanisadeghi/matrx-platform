"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

interface VersionInfo {
  version: string;
  buildNumber: number;
  gitCommit?: string;
  deployedAt: string;
}

interface UseAppVersionOptions {
  /**
   * How often to check for updates (in milliseconds).
   * Default: 5 minutes (300_000ms). Set to 0 to disable polling.
   */
  pollingInterval?: number;

  /**
   * Check for updates on route changes.
   * Default: true
   */
  checkOnRouteChange?: boolean;

  /**
   * Callback when a new version is detected.
   */
  onUpdateAvailable?: (
    newVersion: VersionInfo,
    currentVersion: VersionInfo
  ) => void;

  /**
   * Enable debug logging.
   * Default: false
   */
  debug?: boolean;
}

/**
 * Hook to track app version and detect when updates are available.
 *
 * @example
 * ```tsx
 * const { isUpdateAvailable, currentVersion, latestVersion, reloadApp, dismissUpdate } =
 *   useAppVersion({ pollingInterval: 300_000 });
 * ```
 */
export function useAppVersion(options: UseAppVersionOptions = {}) {
  const {
    pollingInterval = 300_000,
    checkOnRouteChange = true,
    onUpdateAvailable,
    debug = false,
  } = options;

  const pathname = usePathname();
  const [currentVersion, setCurrentVersion] =
    useState<VersionInfo | null>(null);
  const [latestVersion, setLatestVersion] =
    useState<VersionInfo | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if update has been dismissed for this session
  const [isDismissed, setIsDismissed] = useState(false);

  const onUpdateAvailableRef = useRef(onUpdateAvailable);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    onUpdateAvailableRef.current = onUpdateAvailable;
  }, [onUpdateAvailable]);

  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) console.log("[useAppVersion]", ...args);
    },
    [debug]
  );

  /** Fetch version from /api/version */
  const fetchVersion =
    useCallback(async (): Promise<VersionInfo | null> => {
      try {
        const response = await fetch("/api/version", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch version: ${response.statusText}`
          );
        }

        const data = await response.json();
        return {
          version: data.version,
          buildNumber: data.buildNumber,
          gitCommit: data.gitCommit,
          deployedAt: data.deployedAt,
        };
      } catch (err) {
        log("Error fetching version:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
        return null;
      }
    }, [log]);

  /** Compare versions using build number and deployed timestamp. */
  const isNewerVersion = useCallback(
    (newVer: VersionInfo, oldVer: VersionInfo): boolean => {
      if (newVer.buildNumber > oldVer.buildNumber) return true;
      if (
        new Date(newVer.deployedAt) > new Date(oldVer.deployedAt)
      )
        return true;
      return false;
    },
    []
  );

  /** Check for updates against the server. */
  const checkForUpdateRef =
    useRef<(() => Promise<void>) | undefined>(undefined);

  const checkForUpdate = useCallback(async () => {
    if (isCheckingRef.current) {
      log("Already checking for update, skipping");
      return;
    }

    isCheckingRef.current = true;
    setIsChecking(true);
    setError(null);
    log("Checking for update...");

    try {
      const version = await fetchVersion();
      if (!version) {
        log("Failed to fetch version");
        return;
      }

      log("Fetched version:", version);

      setCurrentVersion((current) => {
        if (!current) {
          log("Setting initial version:", version);
          setLatestVersion(version);
          return version;
        }

        if (isNewerVersion(version, current)) {
          log(
            "New version detected:",
            version,
            "Current:",
            current
          );
          setLatestVersion(version);

          setIsDismissed((dismissed) => {
            const shouldShow = !dismissed;
            setIsUpdateAvailable(shouldShow);

            if (shouldShow && onUpdateAvailableRef.current) {
              onUpdateAvailableRef.current(version, current);
            }

            return dismissed;
          });
        } else {
          log("Already on latest version");
          setLatestVersion(version);
        }

        return current;
      });
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
    }
  }, [fetchVersion, isNewerVersion, log]);

  useEffect(() => {
    checkForUpdateRef.current = checkForUpdate;
  }, [checkForUpdate]);

  /** Dismiss the update notification for this session. */
  const dismissUpdate = useCallback(() => {
    log("Dismissing update notification");
    setIsUpdateAvailable(false);
    setIsDismissed(true);
  }, [log]);

  /**
   * Perform a hard reset to get the latest version.
   * Clears caches and forces a completely fresh start.
   */
  const reloadApp = useCallback(async () => {
    log("Performing hard reset...");

    // Clear non-auth localStorage
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          !key.startsWith("sb-") &&
          !key.startsWith("supabase")
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      log("Error clearing localStorage:", e);
    }

    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {
      log("Error clearing sessionStorage:", e);
    }

    // Clear Cache API
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      } catch (e) {
        log("Error clearing browser caches:", e);
      }
    }

    // Unregister service workers
    if ("serviceWorker" in navigator) {
      try {
        const registrations =
          await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((r) => r.unregister())
        );
      } catch (e) {
        log("Error unregistering service workers:", e);
      }
    }

    // Hard navigation with cache-busting param
    const url = new URL(window.location.href);
    url.searchParams.set("_reload", Date.now().toString());
    window.location.replace(url.toString());
  }, [log]);

  // Initial version check
  useEffect(() => {
    log("Running initial version check");
    checkForUpdateRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up _reload query param after hard reset
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("_reload")) {
      url.searchParams.delete("_reload");
      window.history.replaceState({}, "", url.toString());
      log("Cleaned up _reload param from URL");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Polling
  useEffect(() => {
    if (pollingInterval <= 0) {
      log("Polling disabled");
      return;
    }

    log(`Setting up polling interval: ${pollingInterval}ms`);
    const intervalId = setInterval(() => {
      log("Polling for update...");
      checkForUpdateRef.current?.();
    }, pollingInterval);

    return () => {
      log("Clearing polling interval");
      clearInterval(intervalId);
    };
  }, [pollingInterval, log]);

  // Check on route change
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (!checkOnRouteChange) return;
    if (prevPathnameRef.current === pathname) {
      prevPathnameRef.current = pathname;
      return;
    }
    prevPathnameRef.current = pathname;
    log("Route changed, checking for update");
    checkForUpdateRef.current?.();
  }, [pathname, checkOnRouteChange, log]);

  return {
    currentVersion,
    latestVersion,
    isUpdateAvailable,
    isChecking,
    error,
    checkForUpdate,
    dismissUpdate,
    reloadApp,
  };
}
