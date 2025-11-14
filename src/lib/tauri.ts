/**
 * Tauri API wrapper with availability check
 * This prevents errors when running frontend standalone
 */

// Check if Tauri is available
export function isTauriAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI_IPC__" in window && typeof (window as any).__TAURI_IPC__ === "function";
}

// Safe invoke wrapper
export async function safeInvoke<T = any>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauriAvailable()) {
    throw new Error(
      "Tauri is not available. Please run the app using 'npm run tauri:dev' instead of 'npm run dev'"
    );
  }
  
  const { invoke } = await import("@tauri-apps/api/tauri");
  return invoke<T>(cmd, args);
}

// Safe dialog wrapper
export async function safeOpen(options?: any) {
  if (!isTauriAvailable()) {
    throw new Error(
      "Tauri is not available. Please run the app using 'npm run tauri:dev' instead of 'npm run dev'"
    );
  }
  
  const { open } = await import("@tauri-apps/api/dialog");
  return open(options);
}

