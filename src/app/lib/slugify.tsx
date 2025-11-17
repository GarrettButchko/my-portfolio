export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")        // spaces → hyphens
    .replace(/[^\w-]+/g, "");  // remove non-alphanumeric chars
}