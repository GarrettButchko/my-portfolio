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
  actProjs: ActProj[];
  hexColor: string;
  link: string;
};

export type ActProj = {
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

export type GitHubFile = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string | null;
  download_url: string | null;
  type: "file" | "dir" | "symlink" | "submodule";
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

export type RawPost = {
  id?: number;
  title?: string;
  subtitle?: string;
  body?: string;
  tags?: string[];
  relatedProjects?: string[];
  photo?: string | null;
  publish?: string | null | Date;
};
