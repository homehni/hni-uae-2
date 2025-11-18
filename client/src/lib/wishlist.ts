// Wishlist management with localStorage persistence

const WISHLIST_KEY = "bayut_wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(propertyId: string): boolean {
  const wishlist = getWishlist();
  return wishlist.includes(propertyId);
}

export function addToWishlist(propertyId: string): void {
  const wishlist = getWishlist();
  if (!wishlist.includes(propertyId)) {
    wishlist.push(propertyId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { propertyId, action: "add" } }));
  }
}

export function removeFromWishlist(propertyId: string): void {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((id) => id !== propertyId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  
  // Dispatch custom event for other components to react
  window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: { propertyId, action: "remove" } }));
}

export function toggleWishlist(propertyId: string): boolean {
  const isCurrentlyInWishlist = isInWishlist(propertyId);
  
  if (isCurrentlyInWishlist) {
    removeFromWishlist(propertyId);
    return false;
  } else {
    addToWishlist(propertyId);
    return true;
  }
}
