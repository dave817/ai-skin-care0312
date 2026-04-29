const STORAGE_KEY = "dgb-device-id";

function uuidv4(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = uuidv4();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return uuidv4();
  }
}
