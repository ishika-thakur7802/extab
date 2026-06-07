import { getTrackedTabs } from './trackTabActivity.js';

const IDLE_TIME_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export async function getIdleTabs() {
  const trackedTabs = await getTrackedTabs();
  const now = Date.now();

  const idleTabs = trackedTabs.filter(tab => {
    const timeSinceAccess = now - tab.lastAccessed;
    return timeSinceAccess >= IDLE_TIME_MS;
  });

  return idleTabs;
}

export function getIdleTimeFormatted(lastAccessedMs) {
  const now = Date.now();
  const diffMs = now - lastAccessedMs;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m ago`;
}