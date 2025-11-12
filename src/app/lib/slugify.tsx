export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")        // spaces → hyphens
    .replace(/[^\w-]+/g, "");  // remove non-alphanumeric chars
}

export function deslugify(slug: string, capitalize = true) {
  // Replace hyphens with spaces
  let title = slug.replace(/-/g, " ");

  if (capitalize) {
    // Capitalize first letter of each word
    title = title.replace(/\b\w/g, char => char.toUpperCase());
  }

  return title;
}