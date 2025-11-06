import 'server-only';
import { Project } from "@/app/Types/Project";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const headers = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `token ${GITHUB_TOKEN}`,
};

async function fetchSafeJSON(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

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

  const projects: Project[] = [];

  for (const repo of repos) {
    try {
      // 1️⃣ Try to fetch project.json (optional)
      const projectFileData = await fetchSafeJSON(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/project.json`,
        { headers }
      );

      if (!projectFileData) {
        // No project.json → skip quietly
        console.log(`ℹ️ Skipping ${repo.name} (no project.json)`);
        continue;
      }

      // 2️⃣ Get actual project.json content
      const projectJSON = await fetchSafeJSON(projectFileData.download_url);
      if (!projectJSON) continue;
      const project: Project = projectJSON;

      // 3️⃣ Fetch languages (optional)
      const languages = (await fetchSafeJSON(repo.languages_url, { headers })) || {};

      // 4️⃣ Try to load screenshots folder (optional)
      const ssFiles = await fetchSafeJSON(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/Screen_Shots`,
        { headers }
      );

      const photos =
        ssFiles?.filter(
          (f: any) => f.type === "file" && /\.(png|jpe?g|gif|webp)$/i.test(f.name)
        ).map((f: any) => f.download_url) || [];

      // 5️⃣ Mark featured projects
      const feature =
        project.feature ||
        project.title === "Mini Mate" ||
        project.title === "Portfolio Website";

      projects.push({
        ...project,
        link: repo.html_url,
        languages,
        photos,
        feature,
      });
    } catch (err) {
      console.error(`Error processing repo ${repo.name}:`, err);
    }
  }

  return projects;
}


