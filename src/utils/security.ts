/**
 * Security, Data Sanitization, and Safe Storage Utilities
 * Protects against XSS, script injection, malformed storage corruption, and malicious links.
 */

/**
 * Strips HTML tags, script tags, event handlers, and encodes dangerous characters
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    if (input === null || input === undefined) return '';
    return String(input);
  }

  // 1. Remove dangerous script and iframe tags
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 2. Strip inline event handlers (onerror, onload, onclick, onmouseover, etc.)
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '');
  cleaned = cleaned.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  // 3. Strip javascript: and data: pseudo-protocols
  cleaned = cleaned.replace(/javascript\s*:/gi, '');
  cleaned = cleaned.replace(/data\s*:\s*text\/html/gi, '');

  // 4. Encode angle brackets to neutralize raw HTML injection while keeping readability
  cleaned = cleaned
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return cleaned.trim();
}

/**
 * Safely validates and sanitizes external URLs to prevent javascript: or data: XSS vectors
 */
export function sanitizeUrl(url: unknown, fallback: string = '#'): string {
  if (typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // Block dangerous protocols
  const isDangerous = /^(javascript:|data:|vbscript:)/i.test(trimmed);
  if (isDangerous) {
    return fallback;
  }

  // Allow standard web protocols
  const isSafeProtocol = /^(https?:\/\/|mailto:|\/)/i.test(trimmed);
  if (!isSafeProtocol && !trimmed.startsWith('#')) {
    // If protocol is missing, default to https://
    return `https://${trimmed}`;
  }

  return trimmed;
}

/**
 * Safely parses JSON from localStorage or external sources with fallback and schema validation
 */
export function safeJsonParse<T>(
  raw: string | null | undefined,
  fallback: T,
  validator?: (data: unknown) => boolean
): T {
  if (!raw || typeof raw !== 'string') {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      console.warn('[Security] JSON schema validation failed. Reverting to safe fallback.');
      return fallback;
    }
    return parsed as T;
  } catch (err) {
    console.warn('[Security] JSON parse exception encountered. Reverting to safe fallback.', err);
    return fallback;
  }
}

/**
 * Deep sanitizes text properties within student profile or notes before persistence
 */
export function sanitizeProfileStrings<T extends object>(record: T): T {
  const result = { ...record } as Record<string, unknown>;
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === 'string') {
      result[key] = sanitizeInput(val);
    }
  }
  return result as T;
}
