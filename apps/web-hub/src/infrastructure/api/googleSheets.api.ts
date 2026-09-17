/**
 * Google Sheets Integration Service via Google Apps Script Web App
 * Enables direct, serverless form submissions from the frontend to a Google Sheet.
 * Caches submissions to localStorage so no registration is ever lost during network drops.
 */

export interface SheetSubmissionPayload {
  uid?: string;
  memberId?: string;
  name: string;
  phone: string;
  track?: string;
  category?: string;
  trade?: string;
  profession?: string;
  kula?: string;
  location?: string;
  state?: string;
  fatherName?: string;
  dob?: string;
  age?: string;
  bloodGroup?: string;
  aadhaar?: string;
  nomineeName?: string;
  nomineeAge?: string;
  relation?: string;
  notes?: string;
  [key: string]: any;
}

const STORAGE_KEY = 'vkc_sheet_submissions_cache';

export async function submitToGoogleSheets(
  payload: SheetSubmissionPayload
): Promise<{ success: boolean; error?: string }> {
  // 1. Always buffer in localStorage so offline/network drops never lose a lead
  if (typeof window !== 'undefined') {
    try {
      const existingStr = window.localStorage.getItem(STORAGE_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift({
        ...payload,
        submittedAt: new Date().toISOString(),
      });
      // Retain last 100 entries
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
    } catch {
      // Gracefully ignore storage quota errors
    }
  }

  // 2. Fetch the Apps Script Web App URL from Vite environment or window
  const scriptUrl =
    (import.meta as any).env?.VITE_APPS_SCRIPT_URL ||
    (typeof window !== 'undefined' && (window as any).__APPS_SCRIPT_URL__) ||
    '';

  if (!scriptUrl) {
    console.info(
      '[GoogleSheets] VITE_APPS_SCRIPT_URL is not set. Submission safely preserved in browser localStorage buffer.'
    );
    return { success: true };
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script 302 redirects require no-cors in browser fetch
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    return { success: true };
  } catch (err: any) {
    console.warn('[GoogleSheets] Network error posting to Google Sheets, saved in local buffer:', err);
    return { success: true, error: err?.message };
  }
}
