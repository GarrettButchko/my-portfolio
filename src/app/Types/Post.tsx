import { Project } from "@/app/Types/Project"

export type Post = {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  relatedProjects: string[];
  photos: string[];
  publish: Date;
};