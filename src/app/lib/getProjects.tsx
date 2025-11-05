import 'server-only';
import { Project } from "@/app/Types/Project";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const headers = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `token ${GITHUB_TOKEN}`,
};

export async function getProjects(): Promise<Project[]> {
  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    throw new Error("GITHUB_USERNAME or GITHUB_TOKEN not defined in environment");
  }

  console.log("Fetching repos for:", GITHUB_USERNAME);

  const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
  const res = await fetch(API_URL, { headers });

  if (!res.ok) {
    console.error("❌ Failed to fetch repositories:", res.status);
    return [];
  }

  const repos = await res.json();

  const projects: Project[] = await Promise.all(
    repos.map(async (repo: any) => {
      try {
        // 1️⃣ Fetch project.json file (if it exists)
        const repoProjectURL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/project.json`;
        const res2 = await fetch(repoProjectURL, { headers });
        if (!res2.ok) return null;
        const projectFile = await res2.json();

        // 2️⃣ Download actual project.json data
        const res3 = await fetch(projectFile.download_url);
        if (!res3.ok) return null;
        const project: Project = await res3.json();

        // 3️⃣ Fetch repo languages (from repo object, not file)
        const langRes = await fetch(repo.languages_url, { headers });
        const languages = langRes.ok ? await langRes.json() : {};

        // 4️⃣ Fetch screenshots
        const repoSSURL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/Screen_Shots`;
        const ssRes = await fetch(repoSSURL, { headers });

        let photos: string[] = [];
        if (ssRes.ok) {
          const files = await ssRes.json();
          photos = files
            .filter((f: any) => f.type === "file" && /\.(png|jpe?g|gif|webp)$/i.test(f.name))
            .map((f: any) => f.download_url);
        }

        // WHERE TO FEATURE PROJECT
        var feature: boolean = project.feature;
        
        const firstProj: string = "Mini Mate";
        const secondProj: string = "";
        
        if (project.title == firstProj || secondProj){
            feature = true;
        }


        return {
          ...project,
          link: repo.html_url,
          languages,
          photos,
          feature,
        };
      } catch (err) {
        console.error(`Error processing repo ${repo.name}:`, err);
        return null;
      }
    })
  );

  return projects.filter(Boolean) as Project[];
}

