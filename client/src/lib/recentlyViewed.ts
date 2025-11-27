// Recently viewed properties management with localStorage persistence

const RECENTLY_VIEWED_KEY = "homehni_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

export interface RecentlyViewedItem {
  propertyId: string;
  viewedAt: number;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getRecentlyViewedIds(): string[] {
  return getRecentlyViewed().map(item => item.propertyId);
}

export function addToRecentlyViewed(propertyId: string): void {
  if (typeof window === "undefined") return;
  
  let recentlyViewed = getRecentlyViewed();
  
  // Remove if already exists (to move to front)
  recentlyViewed = recentlyViewed.filter(item => item.propertyId !== propertyId);
  
  // Add to beginning
  recentlyViewed.unshift({
    propertyId,
    viewedAt: Date.now(),
  });
  
  // Keep only the most recent items
  recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
  
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
  
  // Dispatch custom event for other components to react
  window.dispatchEvent(new CustomEvent("recently-viewed-updated", { 
    detail: { propertyId, action: "add" } 
  }));
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
  
  window.dispatchEvent(new CustomEvent("recently-viewed-updated", { 
    detail: { action: "clear" } 
  }));
}
