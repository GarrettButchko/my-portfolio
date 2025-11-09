import { Project } from "@/app/Types/Project"

export type Post = {
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  relatedProjects: Project[];
  photos: string[];
  publish: Date;
};