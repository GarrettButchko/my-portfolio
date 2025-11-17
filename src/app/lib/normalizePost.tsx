import type { Post, RawPost } from "@/app/types";


export function normalizePost(raw: RawPost): Post {
  let publishDate: Date;

  if (raw.publish instanceof Date) {
    publishDate = raw.publish;
  } else if (typeof raw.publish === "string") {
    const parsed = new Date(raw.publish);
    publishDate = isNaN(parsed.getTime()) ? new Date() : parsed;
  } else {
    publishDate = new Date();
  }

  return {
    id: raw.id ?? 0,
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    body: raw.body ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    relatedProjects: Array.isArray(raw.relatedProjects) ? raw.relatedProjects : [],
    photo: raw.photo ?? null,
    publish: publishDate, // now always a Date
  };
}
