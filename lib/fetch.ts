import fs from "fs";
import path from "path";
import Cite from "citation-js";
import matter from "gray-matter";
import { parseBibFile } from "bibtex";
import { mdToHtml } from "./mdToHtml";

export function getPersonalData() {
  const personalStr = fs.readFileSync(path.join(process.cwd(), "data", "personal.json"), "utf-8");
  const personal: typeof import("@/data/personal.json") = JSON.parse(personalStr);

  return personal;
}

export async function getBlurb() {
  const blurbStr = fs.readFileSync(path.join(process.cwd(), "data", "blurb.md"), "utf-8");
  const blurb = await mdToHtml(blurbStr);
  return blurb;
}

export async function getInterests() {
  const interestsStr = fs.readFileSync(path.join(process.cwd(), "data", "interests.md"), "utf-8");
  const interests = await mdToHtml(interestsStr);

  return interests;
}

export function getPublications() {
  let str = fs.readFileSync(path.join(process.cwd(), "data", "publications.bib"), "utf-8");
  let citations = Cite.input(str);
  let bibFile = parseBibFile(str);
  for (const citation of citations) {
    let entry = bibFile.getEntry(citation.id);
    citation["poster"] = entry.getFieldAsString("poster") || null;
    citation["shorttitle"] = entry.getFieldAsString("shorttitle") || null;
    citation["selected"] = entry.getFieldAsString("selected") || 0;
    citation["topic"] = entry.getFieldAsString("topic") || "";
    citation["project"] = entry.getFieldAsString("project") || null;
    citation["code"] = entry.getFieldAsString("code") || null;
  }

  return citations;
}

export function getProjects() {
  const projectsStr = fs.readFileSync(path.join(process.cwd(), "data", "projects.json"), "utf-8");
  const projects: typeof import("@/data/projects.json") = JSON.parse(projectsStr);

  return projects;
}

export function getCollaborators() {
  const collaboratorsStr = fs.readFileSync(path.join(process.cwd(), "data", "group.json"), "utf-8");
  const collaborators: typeof import("@/data/group.json") = JSON.parse(collaboratorsStr);

  return collaborators;
}

export function getAwards() {
  const collaboratorsStr = fs.readFileSync(path.join(process.cwd(), "data", "awards.json"), "utf-8");
  const collaborators: typeof import("@/data/awards.json") = JSON.parse(collaboratorsStr);

  return collaborators;
}

export function getCompilationDate() {
  return new Date().toDateString();
}

const postDirectory = path.join(process.cwd(), "data", "posts");

export function getPostSlugs() {
  return fs.readdirSync(postDirectory).map((post) => post.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  let fullPath = path.join(postDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: any;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.lastmod > post2.lastmod ? -1 : 1));
  return posts;
}
