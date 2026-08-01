import { AppSavedProgress } from "../types";

const LOCAL_STORAGE_KEY = "happy_girlfriend_day_progress_v1";

export function getSessionId(): string {
  let session = localStorage.getItem("hgd_session_id");
  if (!session) {
    session = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("hgd_session_id", session);
  }
  return session;
}

export function getDeviceInfo(): { device: string; location: string } {
  const ua = navigator.userAgent;
  let device = "Desktop Browser";
  if (/mobile/i.test(ua)) device = "Mobile Phone";
  if (/tablet|ipad/i.test(ua)) device = "Tablet";
  
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Timezone";
  return { device: `${device} (${navigator.platform || "Web"})`, location: tz };
}

export function loadSavedProgress(): AppSavedProgress | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppSavedProgress;
  } catch (e) {
    console.warn("Failed to load saved progress", e);
    return null;
  }
}

export function saveProgress(progress: Partial<AppSavedProgress>) {
  try {
    const existing = loadSavedProgress() || {
      currentPage: 0,
      isUnlocked: false,
      quizScore: 0,
      quizAnswered: {},
      openedFlowers: [],
      foundHearts: [],
      openedStars: [],
      musicEnabled: false,
      darkMode: false,
      finalResponse: null,
      sessionId: getSessionId(),
    };

    const updated = { ...existing, ...progress };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save progress", e);
  }
}

export function clearSavedProgress() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}
