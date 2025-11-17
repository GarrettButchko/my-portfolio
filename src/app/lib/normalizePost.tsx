import type { Post } from "@/app/types";

export function normalizePost(raw: any): Post {
  return {
    id: raw.id ?? 0,
    title: raw.title ?? "",
    subtitle: raw.subtitle ?? "",
    body: raw.body ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    relatedProjects: Array.isArray(raw.relatedProjects)
      ? raw.relatedProjects
      : [],
    photo: raw.photo ?? null,
    publish:
      typeof raw.publish === "string"
        ? raw.publish
        : raw.publish?.toISOString?.() ?? new Date().toISOString(),
  };
}
