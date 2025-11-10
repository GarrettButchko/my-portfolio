type InfoItem = {
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

type actProj = {
  title: string;
  body: string;
  skills: string[];
}