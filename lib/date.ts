export const formatTime = (timestamp: number): string => {
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    return "N/A";
  }
  const date = new Date(timestamp);
  // Using toLocaleString is often preferred as it combines date and time
  // and intelligently uses the user's locale settings.
  return date.toLocaleString();
};
