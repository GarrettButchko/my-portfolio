export type InfoItem = {
  id: number;
  title: string;
  majorOrEmployer: string;
  gpa?: string | number;
  loc: string;
  start: number | string;
  end: number | string;
  in: boolean;
  pic: string;
  picAlt: string;
  actProjs: actProj[];
  hexColor: string;
  link: string;
};

export type actProj = {
  title: string;
  body: string;
  skills: string[];
}

export type Post = {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  relatedProjects: string[];
  photo: string | null;
  publish: Date;
};

export type Project = {
    title: string;
    type: string;
    link: string;
    languages: Record<string, number>;
    photos: string[];
    feature: boolean;
    pushed_at: string;
}