import "server-only";
import { Project, GitHubFile } from "@/app/types";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const headers = {
  Accept: "application/vnd.github.v3+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
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

let projectsPromise: Promise<Project[]> | null = null;
let cache: Project[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function getProjects(): Promise<Project[]> {
  if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
    throw new Error("GITHUB_USERNAME or GITHUB_TOKEN not defined in environment");
  }

  // Return cached version if recent
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    console.log("🪣 Using cached GitHub projects");
    return cache;
  }

  // Return shared promise if fetch is ongoing
  if (projectsPromise) {
    console.log("⏳ Returning existing getProjects() promise");
    return projectsPromise;
  }

  // Start a new fetch
  projectsPromise = (async () => {
    console.log("🔄 Fetching from GitHub...");
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    const res = await fetch(API_URL, { headers });

    console.log("🔐 GitHub token prefix:", process.env.GITHUB_TOKEN?.slice(0, 10));

    if (!res.ok) {
      console.error("❌ Failed to fetch repositories:", res.status);
      projectsPromise = null;
      return cache || [];
    }

    const repos = await res.json();
    const projects: Project[] = [];

    for (const repo of repos) {
      try {
        const projectFileData = await fetchSafeJSON(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/project.json`,
          { headers }
        );

        if (!projectFileData) {
          console.log(`ℹ️ Skipping ${repo.name} (no project.json)`);
          continue;
        }

        const projectJSON = await fetchSafeJSON(projectFileData.download_url);
        if (!projectJSON) continue;

        const project: Project = projectJSON;
        const languages = (await fetchSafeJSON(repo.languages_url, { headers })) || {};

        const ssFiles = await fetchSafeJSON(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/Screen_Shots`,
          { headers }
        );

        const photos =
          ssFiles?.filter(
            (f: GitHubFile) => f.type === "file" && /\.(png|jpe?g|gif|webp)$/i.test(f.name)
          ).map((f: GitHubFile) => f.download_url) || [];

        const feature =
          project.feature ||
          project.title === "Mini Mate" ||
          project.title === "Portfolio";

        projects.push({
          ...project,
          link: repo.html_url,
          languages,
          photos,
          feature,
          pushed_at: repo.pushed_at,
        });
      } catch (err) {
        console.error(`Error processing repo ${repo.name}:`, err);
      }
    }

    // ✅ Update cache after successful fetch
    cache = projects;
    cacheTime = Date.now();

    // ✅ Allow new fetch later
    projectsPromise = null;

    return projects;
  })();

  return projectsPromise;
}
