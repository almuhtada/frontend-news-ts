/**
 * Get or create a unique user identifier for anonymous users
 * This is used for tracking likes from non-logged-in users
 * Uses a combination of browser fingerprint stored in localStorage
 */
export const getUserIdentifier = (): string => {
  const STORAGE_KEY = "user_identifier";

  // Try to get existing identifier from localStorage
  let identifier = localStorage.getItem(STORAGE_KEY);

  if (!identifier) {
    // Generate a new unique identifier
    // Format: timestamp-random-string
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    identifier = `${timestamp}-${randomStr}`;

    // Store for future use
    localStorage.setItem(STORAGE_KEY, identifier);
  }

  return identifier;
};

/**
 * Get user IP address (fallback to identifier if IP not available)
 * In production, you might want to get this from the backend
 */
export const getUserIP = async (): Promise<string> => {
  try {
    // You can replace this with your own IP detection service
    // For now, we'll use the user identifier as fallback
    return getUserIdentifier();
  } catch (error) {
    console.error("Failed to get user IP:", error);
    return getUserIdentifier();
  }
};
