export function formatDate(dateInput: Date | string | number): string {
  // Convert input into a real Date object
  const date =
    dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Safety check in case conversion failed
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 🔄 Opposite of formatDate
// Takes a human-readable date string and returns a real Date object
export function parseDate(dateString: string): Date | null {
  // Try to let JS parse the string
  const date = new Date(dateString);

  // Check for invalid parsed date
  if (isNaN(date.getTime())) {
    console.warn("❌ parseDate: invalid date string:", dateString);
    return null;
  }

  return date;
}

