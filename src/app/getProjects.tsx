import 'server-only';


// app/lib/getProjects.ts
export type Project = {
    title: string;
    type: string;
    languages: string[];
    photos: string[];
};

// --- Load environment variables (server-only) ---
const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;

const headers = {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${GITHUB_TOKEN}`,
};

// --- Main server-side function ---
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
            // 1️⃣ Fetch project.json
            const repoProjectURL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/project.json`;
            const res2 = await fetch(repoProjectURL, { headers });
            if (!res2.ok) return null;
            const projectFullInfo = await res2.json();

            const realProjURL = projectFullInfo.download_url;
            const res4 = await fetch(realProjURL, { headers });
            if (!res4.ok) return null;
            const project: Project = await res4.json();

            // 2️⃣ Fetch Screen_Shots folder
            const repoSSURL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/Screen_Shots`;
            const res3 = await fetch(repoSSURL, { headers });

            let photos: string[] = [];
            if (res3.ok) {
                const screenShotsObjects = await res3.json();
                photos = screenShotsObjects
                    .filter((f: any) => f.type === "file" && /\.(png|jpe?g|gif|webp)$/i.test(f.name))
                    .map((f: any) => f.download_url);
            }

            // Merge project.json with photos
            return {
                ...project,
                photos,
            };
        })
    );

    return (projects.filter(Boolean));
}

