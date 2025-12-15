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
    logo: "/mentorlink-logo.png",
    title: "MentorLink",
    description:
      "A modern web platform revolutionizing academic mentorship management for Manipal University Jaipur. It streamlines mentor–mentee pairing, meeting scheduling, progress tracking, and real-time collaboration with a focus on accessibility and data-driven insights.",
    techStack: [
      "Next.js 13+",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "MongoDB",
      "Mongoose",
      "JWT",
    ],
    link: "https://mentorlink-nu.vercel.app/",
    source: "https://github.com/SDC-MUJ/mentor-mentee",
  },
  {
    logo: "/it-ticketing-system.png",
    title: "IT Ticketing System",
    description:
      "An enterprise-grade helpdesk solution built for Manipal University Jaipur to streamline IT service requests. It features role-based dashboards, ticket lifecycle management, OTP-based authentication, email verification, and Microsoft SSO integration.",
    techStack: [
      "Next.js 13+",
      "TypeScript",
      "MongoDB",
      "Prisma",
      "NextAuth.js",
      "Tailwind CSS",
      "Heroicons",
    ],
    link: "https://helpdesk-mocha.vercel.app/",
    source: "https://github.com/DoctorDictator/it-ticketing-system",
  },
  {
    logo: "/note-taking-app.png",
    title: "Note-Taking App",
    description:
      "A full-featured note-taking application built with a relational backend, supporting CRUD operations, categories, search, and user authentication with a clean UI.",
    techStack: [
      "Next.js 13+",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Tailwind CSS",
      "React",
    ],
    link: "https://rdbms-muj.vercel.app/",
    source: "https://github.com/DoctorDictator/rdbbms-project-2025",
  },
  {
    logo: "/canva.svg",
    title: "Canva Clone / Editor App",
    description:
      "A web-based design editor inspired by Canva, supporting block and layer editing, asset manipulation, and export functionalities with a dynamic canvas rendering system.",
    techStack: [
      "Next.js 13+",
      "TypeScript",
      "Canvas API / Konva / Fabric.js",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    link: "https://neocanva.vercel.app",
    source: "https://github.com/DoctorDictator/Canva",
  },
  {
    logo: "/pathfinding-visualizer.png",
    title: "Pathfinding Visualizer",
    description:
      "An interactive visualization tool demonstrating graph traversal algorithms such as A*, Dijkstra, BFS, and DFS on dynamic grids with weighted nodes and walls.",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    link: "https://doctordictator.github.io/Pathfinding-Visualizer/",
    source: "https://github.com/DoctorDictator/Pathfinding-Visualizer",
  },
  {
    logo: "/web-wallet.png",
    title: "Web Wallet",
    description:
      "A decentralized multi-chain wallet for Solana and Ethereum built with React and TypeScript. It features mnemonic generation, secure key derivation, and an interactive UI for managing wallets — built as a blockchain learning project.",
    techStack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "bip39",
      "@solana/web3.js",
      "tweetnacl",
      "ethers.js",
      "React Icons",
    ],
    link: "https://web-wallet-wheat.vercel.app",
    source: "https://github.com/DoctorDictator/web-wallet",
  },
  {
    logo: "",
    title: "GTA-VI Landing Page",
    description:
      "A sleek, interactive landing page built with React, TypeScript, and Vite, styled using Tailwind CSS, and enhanced with GSAP ScrollTrigger for cinematic scroll-based animations, pinned sections, and scroll-synced video playback in a fully responsive layout.",
    techStack: [
      "React", 
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "GSAP",
      "ScrollTrigger",
    ],
    link: "https://gta-vi-landing-page-phi.vercel.app",
    source: "https://github.com/DoctorDictator/GTA-VI-landing-page",
  },
  
];
