"use client";

import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import Title from "@/components/ui/Title";
import { useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Badge } from "@radix-ui/themes";
import { bricolage_grotesque } from "@/utils/fonts";

const ProjectCardList = () => {
  const [visibleProjects, setVisibleProjects] = useState(6);

  const loadMoreProjects = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  return (
    <div className="w-full h-fit px-64 max-[1025px]:px-4 max-[1285px]:px-40 max-lg:px-0 max-sm:px-4 flex flex-col items-center mt-4 pb-8">
      <Title title="Proof of Work" />

      <div className="flex w-full flex-col gap-4 lg:flex-row mt-4 px-32 max-lg:px-0 max-sm:px-0 flex-wrap items-center ml-14 max-sm:ml-0 max-lg:ml-0 max-[350px]:mr-5 max-[321px]:mr-10">
        {data.slice(0, visibleProjects).map((project: Project, idx: number) => (
          <ProjectCard
            key={idx}
            logo={project.logo}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            link={project.link}
            source={project.source}
          />
        ))}
      </div>
      {visibleProjects < data.length && (
        <Badge
          color="gray"
          variant="solid"
          highContrast
          onClick={loadMoreProjects}
          className={`text-xs max-sm:text-[10px] flex items-center text-center dark:hover:bg-gray-300 py-1 px-2 cursor-pointer hover:bg-gray-800 mt-6 ${bricolage_grotesque}`}
        >
          <span>Load More</span>
          <span className="!ml-[-3px] mt-[1px]">
            <ChevronDownIcon className="h-3 w-3 dark:!text-black !text-white  shrink-0 text-muted-foreground transition-transform duration-200" />
          </span>
        </Badge>
      )}
    </div>
  );
};

export default ProjectCardList;

const data: Project[] = [
  {
    logo: "/note-taking-app.png",
    title: "Note-Taking App",
    description:
      "A full-featured note-taking application built with a relational backend, with CRUD, categories, search, and user auth.",
    techStack: [
      "Node.js",
      "Express",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "React",
      "Tailwind CSS",
    ],
    link: "", // add your deployed URL if you have one
    source: "https://github.com/DoctorDictator/note-taking-app",
  },
  {
    logo: "/it-ticketing-system.png",
    title: "IT Ticketing System",
    description:
      "Role-based IT ticketing platform with admin, worker & user dashboards, ticket lifecycle, SLAs, and metrics.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    link: "", // add your deployed URL if available
    source: "https://github.com/DoctorDictator/it-ticketing-system",
  },
  {
    logo: "/canva.svg",
    title: "Canva Clone / Editor App",
    description:
      "A canvas / design editor app that mimics Canva’s block & layer editing functionality.",
    techStack: [
      "React",
      "TypeScript",
      "Canvas API / Konva / Fabric.js",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    link: "", // add your live link if deployed
    source: "https://github.com/DoctorDictator/Canva",
  },
  {
    logo: "/pathfinding-visualizer.png",
    title: "Pathfinding Visualizer",
    description:
      "Visualize algorithms like A*, Dijkstra, BFS, DFS on grids with walls, weights, and live animations.",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    link: "", // add deployed link, e.g. Vercel/GitHub Pages
    source: "https://github.com/DoctorDictator/Pathfinding-Visualizer",
  },
];
