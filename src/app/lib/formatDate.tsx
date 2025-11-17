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

