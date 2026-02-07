/**
 * Error Reporter
 *
 * Fire-and-forget error reporting client.
 * Safe to call from anywhere — never throws, never blocks.
 *
 * Design principles:
 * 1. All public methods are wrapped in try/catch — NOTHING escapes.
 * 2. Uses a queue with periodic flush, not synchronous HTTP.
 * 3. Fails silently on network errors.
 * 4. Client-side rate limiting per fingerprint to prevent flooding.
 * 5. Supports breadcrumb trail for debugging context.
 */

import type {
  ErrorLevel,
  ErrorPlatform,
  ErrorBreadcrumb,
  ErrorReportPayload,
  CaptureExtras,
} from "../types/errors";
import { ERROR_TRACKING } from "../constants/app";

interface ErrorReporterConfig {
  /** Base URL for the error ingestion API (e.g. "/api/errors" or "https://api.example.com/api/errors") */
  endpoint: string;
  /** Platform identifier */
  platform: ErrorPlatform;
  /** Current environment */
  environment?: string;
  /** Current app release/version */
  release?: string;
  /** Whether error tracking is enabled (false = all calls are no-ops) */
  enabled?: boolean;
  /** Max items in the queue before auto-flushing */
  maxQueueSize?: number;
  /** Flush interval in ms */
  flushIntervalMs?: number;
  /** Custom fetch implementation (for environments without global fetch) */
  fetchFn?: typeof fetch;
  /** Function to get current user ID (called lazily at capture time) */
  getUserId?: () => string | undefined;
  /** Function to get current route/URL (called lazily at capture time) */
  getUrl?: () => string | undefined;
  /** Tags applied to every reported error */
  defaultTags?: Record<string, string>;
  /** Enable debug logging to console */
  debug?: boolean;
}

const DEFAULT_CONFIG: Required<ErrorReporterConfig> = {
  endpoint: "/api/errors",
  platform: "web",
  environment: "production",
  release: "",
  enabled: true,
  maxQueueSize: ERROR_TRACKING.CLIENT_QUEUE_MAX_SIZE,
  flushIntervalMs: ERROR_TRACKING.CLIENT_FLUSH_INTERVAL_MS,
  fetchFn:
    typeof fetch !== "undefined"
      ? fetch
      : ((() => Promise.resolve(new Response())) as typeof fetch),
  getUserId: () => undefined,
  getUrl: () => undefined,
  defaultTags: {},
  debug: false,
};

class ErrorReporter {
  private config: Required<ErrorReporterConfig> = { ...DEFAULT_CONFIG };
  private queue: ErrorReportPayload[] = [];
  private breadcrumbs: ErrorBreadcrumb[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private rateLimits = new Map<string, { count: number; resetAt: number }>();
  private initialized = false;
  private userId: string | undefined;

  /**
   * Initialize the error reporter. Safe to call multiple times.
   * Must be called before any errors will be captured.
   */
  init(config: ErrorReporterConfig): void {
    try {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.initialized = true;

      // Start periodic flush
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
      }
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushIntervalMs);

      this.debugLog("Error reporter initialized");
    } catch {
      // Initialization itself must not fail
    }
  }

  /**
   * Capture an error (Error object, string, or anything).
   * Never throws. Fire-and-forget.
   */
  captureError(error: unknown, extras?: CaptureExtras): void {
    try {
      if (!this.isEnabled()) return;

      const { message, stack } = this.normalizeError(error);
      const level = extras?.level ?? (stack ? "error" : "warning");

      this.enqueue({
        message,
        stackTrace: stack,
        level,
        platform: this.config.platform,
        environment: this.config.environment,
        release: this.config.release || undefined,
        userId: this.resolveUserId(),
        url: extras?.component ? undefined : this.resolveUrl(),
        component: extras?.component,
        action: extras?.action,
        breadcrumbs: [...this.breadcrumbs],
        context: extras?.context ?? {},
        tags: { ...this.config.defaultTags, ...extras?.tags },
        fingerprint: extras?.fingerprint,
      });
    } catch {
      // Must never throw
    }
  }

  /**
   * Capture a message (non-Error) with a severity level.
   * Never throws. Fire-and-forget.
   */
  captureMessage(
    message: string,
    level: ErrorLevel = "warning",
    extras?: CaptureExtras
  ): void {
    try {
      if (!this.isEnabled()) return;

      this.enqueue({
        message,
        level,
        platform: this.config.platform,
        environment: this.config.environment,
        release: this.config.release || undefined,
        userId: this.resolveUserId(),
        url: this.resolveUrl(),
        component: extras?.component,
        action: extras?.action,
        breadcrumbs: [...this.breadcrumbs],
        context: extras?.context ?? {},
        tags: { ...this.config.defaultTags, ...extras?.tags },
        fingerprint: extras?.fingerprint,
      });
    } catch {
      // Must never throw
    }
  }

  /**
   * Add a breadcrumb to the trail. Oldest breadcrumbs are dropped
   * when the limit is reached.
   */
  addBreadcrumb(crumb: Partial<ErrorBreadcrumb> & { message: string }): void {
    try {
      if (!this.isEnabled()) return;

      this.breadcrumbs.push({
        timestamp: new Date().toISOString(),
        category: crumb.category ?? "custom",
        message: crumb.message,
        level: crumb.level ?? "info",
        data: crumb.data,
      });

      // Trim to max breadcrumbs
      if (this.breadcrumbs.length > ERROR_TRACKING.MAX_BREADCRUMBS) {
        this.breadcrumbs = this.breadcrumbs.slice(
          -ERROR_TRACKING.MAX_BREADCRUMBS
        );
      }
    } catch {
      // Must never throw
    }
  }

  /** Set the current user ID for error attribution */
  setUser(userId: string | undefined): void {
    try {
      this.userId = userId;
    } catch {
      // Must never throw
    }
  }

  /** Merge additional default tags */
  setTags(tags: Record<string, string>): void {
    try {
      this.config.defaultTags = { ...this.config.defaultTags, ...tags };
    } catch {
      // Must never throw
    }
  }

  /** Flush the queue immediately. Returns a promise but never rejects. */
  async flush(): Promise<void> {
    try {
      if (this.queue.length === 0) return;

      const batch = this.queue.splice(0);
      await this.sendBatch(batch);
    } catch {
      // Must never throw — dropped events are lost silently
    }
  }

  /** Tear down the reporter (clear timers) */
  destroy(): void {
    try {
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
        this.flushTimer = null;
      }
      // Best-effort final flush (non-blocking)
      this.flush();
      this.initialized = false;
    } catch {
      // Must never throw
    }
  }

  // ─── Private ───────────────────────────────────────

  private isEnabled(): boolean {
    return this.initialized && this.config.enabled;
  }

  private enqueue(payload: ErrorReportPayload): void {
    // Compute fingerprint for rate limiting
    const fp =
      payload.fingerprint ??
      this.computeFingerprint(payload.message, payload.stackTrace);
    payload.fingerprint = fp;

    // Client-side rate limit check
    if (this.isRateLimited(fp)) {
      this.debugLog(`Rate limited: ${fp.slice(0, 8)}...`);
      return;
    }

    this.queue.push(payload);

    // Auto-flush if queue is full
    if (this.queue.length >= this.config.maxQueueSize) {
      this.flush();
    }
  }

  private isRateLimited(fingerprint: string): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(fingerprint);

    if (!entry || now >= entry.resetAt) {
      this.rateLimits.set(fingerprint, {
        count: 1,
        resetAt: now + ERROR_TRACKING.CLIENT_RATE_LIMIT_WINDOW_MS,
      });
      return false;
    }

    entry.count++;
    return entry.count > ERROR_TRACKING.CLIENT_RATE_LIMIT_PER_FINGERPRINT;
  }

  /**
   * Compute a fingerprint for grouping similar errors.
   * Uses a simple but effective approach:
   * 1. Normalize the message (strip variable parts)
   * 2. Extract top stack frames (file + function, no line numbers)
   * 3. Hash the concatenation
   */
  private computeFingerprint(message: string, stackTrace?: string): string {
    let normalized = message
      .replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
        "{{uuid}}"
      )
      .replace(/\b\d+\b/g, "{{n}}")
      .replace(/"[^"]{50,}"/g, '"{{str}}"')
      .toLowerCase()
      .trim();

    if (stackTrace) {
      // Extract top 3 meaningful stack frames
      const frames = stackTrace
        .split("\n")
        .filter((line) => line.includes("at "))
        .slice(0, 3)
        .map((line) => {
          // Keep function name and file, strip line/column numbers
          const match = line.match(/at\s+(\S+).*?([^/\\]+\.\w+)/);
          return match ? `${match[1]}@${match[2]}` : line.trim();
        });
      normalized += "|" + frames.join("|");
    }

    return this.simpleHash(normalized);
  }

  /**
   * Simple string hash (djb2 variant).
   * Not cryptographic — just for grouping. Works in all JS runtimes.
   */
  private simpleHash(str: string): string {
    let hash1 = 5381;
    let hash2 = 52711;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash1 = (hash1 * 33) ^ char;
      hash2 = (hash2 * 33) ^ char;
    }
    // Produce a hex string from both hashes for lower collision rate
    return (
      (hash1 >>> 0).toString(16).padStart(8, "0") +
      (hash2 >>> 0).toString(16).padStart(8, "0")
    );
  }

  private normalizeError(error: unknown): { message: string; stack?: string } {
    if (error instanceof Error) {
      return {
        message: error.message || String(error),
        stack: error.stack,
      };
    }
    if (typeof error === "string") {
      return { message: error };
    }
    if (typeof error === "object" && error !== null) {
      const obj = error as Record<string, unknown>;
      return {
        message: (obj.message as string) ?? JSON.stringify(error),
        stack: obj.stack as string | undefined,
      };
    }
    return { message: String(error) };
  }

  private async sendBatch(items: ErrorReportPayload[]): Promise<void> {
    const body = items.length === 1 ? items[0] : items;

    for (let attempt = 0; attempt < ERROR_TRACKING.CLIENT_RETRY_MAX; attempt++) {
      try {
        const response = await this.config.fetchFn(this.config.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          // Prevent the request from blocking navigation
          keepalive: true,
        });

        // 2xx = success, 429 = rate limited (drop), anything else = retry
        if (response.ok || response.status === 429) {
          this.debugLog(`Sent ${items.length} error(s) — ${response.status}`);
          return;
        }
      } catch {
        // Network error — retry
      }

      // Exponential backoff
      if (attempt < ERROR_TRACKING.CLIENT_RETRY_MAX - 1) {
        await this.sleep(
          ERROR_TRACKING.CLIENT_RETRY_DELAY_MS * Math.pow(2, attempt)
        );
      }
    }

    // All retries exhausted — drop silently
    this.debugLog(
      `Dropped ${items.length} error(s) after ${ERROR_TRACKING.CLIENT_RETRY_MAX} retries`
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private resolveUserId(): string | undefined {
    try {
      return this.userId ?? this.config.getUserId();
    } catch {
      return undefined;
    }
  }

  private resolveUrl(): string | undefined {
    try {
      return this.config.getUrl();
    } catch {
      return undefined;
    }
  }

  private debugLog(msg: string): void {
    if (this.config.debug) {
      try {
        console.debug(`[ErrorReporter] ${msg}`);
      } catch {
        // Even debug logging must not fail
      }
    }
  }
}

/** Singleton instance — safe to import from anywhere */
export const errorReporter = new ErrorReporter();
