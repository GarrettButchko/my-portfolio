// app/api/projects/route.ts
import { getProjects } from "@/app/getProjects";
import { NextResponse } from "next/server";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}