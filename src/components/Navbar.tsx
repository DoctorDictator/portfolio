"use client";

import React, { useMemo } from "react";
import { Link, Separator, Tooltip } from "@radix-ui/themes";
import {
  GitHubLogoIcon,
  SunIcon,
  MoonIcon,
  FileIcon,
  RowsIcon,
  LinkedInLogoIcon,
  CodeIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { useDarkMode } from "@/hooks/useDarkMode";

// Navigation item interface
interface NavItem {
  href: string;
  icon: React.ReactNode;
  tooltip: string;
  isActive: (pathname: string) => boolean;
}

// External link interface
interface ExternalLink {
  href: string;
  icon: React.ReactNode;
  tooltip: string;
  ariaLabel: string;
}

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const pathname = usePathname();

  // Shared style constants
  const iconSize = "w-[19px] h-[19px] max-sm:w-[15px] max-sm:h-[15px]";
  const buttonBaseClass =
    "hover:px-3 max-sm:hover:px-2 py-2.5 dark:hover:bg-zinc-700 hover:bg-zinc-100 rounded-full transition-all duration-300";
  const activeIconClass = "dark:!text-amber-400 !text-amber-600";

  // Navigation items configuration
  const navItems: NavItem[] = useMemo(
    () => [
      {
        href: "/",
        icon: <HomeIcon className={iconSize} />,
        tooltip: "Home",
        isActive: (path) => path === "/",
      },
      {
        href: "/projects",
        icon: <CodeIcon className={iconSize} />,
        tooltip: "Projects",
        isActive: (path) => path === "/projects",
      },
      {
        href: "/blogs",
        icon: <RowsIcon className="w-4 h-4 max-sm:w-[13px] max-sm:h-[13px]" />,
        tooltip: "Blog",
        isActive: (path) => path.startsWith("/blogs"),
      },
      {
        href: "/about",
        icon: (
          <IoPerson className="w-[18px] h-[18px] max-sm:w-[15px] max-sm:h-[15px]" />
        ),
        tooltip: "About",
        isActive: (path) => path === "/about",
      },
    ],
    [iconSize]
  );

  // External links configuration
  const externalLinks: ExternalLink[] = useMemo(
    () => [
      {
        href: "#", // TODO: Add actual resume link
        icon: <FileIcon className={iconSize} />,
        tooltip: "Resume",
        ariaLabel: "Download resume",
      },
      {
        href: "https://github.com/DoctorDictator",
        icon: <GitHubLogoIcon className={iconSize} />,
        tooltip: "GitHub",
        ariaLabel: "Visit GitHub profile",
      },
      {
        href: "https://x.com/harshshishodia_",
        icon: (
          <FaXTwitter className="w-[17px] h-[17px] max-sm:w-[15px] max-sm:h-[15px]" />
        ),
        tooltip: "X (Twitter)",
        ariaLabel: "Visit X profile",
      },
      {
        href: "https://www.linkedin.com/in/harsh-shishodia/",
        icon: <LinkedInLogoIcon className={iconSize} />,
        tooltip: "LinkedIn",
        ariaLabel: "Visit LinkedIn profile",
      },
    ],
    [iconSize]
  );

  // Render navigation item
  const renderNavItem = (item: NavItem) => {
    const isActive = item.isActive(pathname);

    return (
      <Link key={item.href} href={item.href} underline="none">
        <Tooltip content={item.tooltip}>
          <div className={buttonBaseClass}>
            {React.cloneElement(item.icon as React.ReactElement, {
              className: `${
                (item.icon as React.ReactElement).props.className
              } text-black dark:text-white ${isActive ? activeIconClass : ""}`,
            })}
          </div>
        </Tooltip>
      </Link>
    );
  };

  // Render external link
  const renderExternalLink = (link: ExternalLink) => (
    <Link
      key={link.href}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      underline="none"
      aria-label={link.ariaLabel}
    >
      <Tooltip content={link.tooltip}>
        <div className={buttonBaseClass}>
          {React.cloneElement(link.icon as React.ReactElement, {
            className: `${
              (link.icon as React.ReactElement).props.className
            } text-black dark:text-white`,
          })}
        </div>
      </Tooltip>
    </Link>
  );

  return (
    <nav
      className="w-full py-6 flex justify-center fixed top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="rounded-full w-[850px] max-lg:w-[800px] max-md:w-[650px] max-sm:w-[500px] max-[500px]:w-[450px] max-[450px]:w-[400px] max-[400px]:w-[350px] max-[350px]:w-[320px] px-2 py-1 bg-white/10 backdrop-blur-lg border border-black/10 dark:border-white/20 flex items-center justify-center shadow-lg dark:shadow-none">
        <div className="flex justify-center px-2 items-center gap-6 max-sm:gap-4 max-[400px]:gap-3 transition-all">
          {/* Navigation Items */}
          {navItems.map(renderNavItem)}

          {/* Separator */}
          <Separator
            orientation="vertical"
            size={{ sm: "1", lg: "2", xl: "2" }}
            className="bg-black/20 dark:bg-white/30 h-6"
          />

          {/* External Links */}
          {externalLinks.map(renderExternalLink)}

          {/* Separator */}
          <Separator
            orientation="vertical"
            size={{ sm: "1", lg: "2", xl: "2" }}
            className="bg-black/20 dark:bg-white/30 h-6"
          />

          {/* Theme Toggle */}
          <Tooltip content={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
            <button
              className={`${buttonBaseClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900`}
              onClick={toggleDarkMode}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              type="button"
            >
              {isDarkMode ? (
                <MoonIcon className="w-[18px] h-[18px] max-sm:w-[14px] max-sm:h-[14px] text-black dark:text-white" />
              ) : (
                <SunIcon className="w-5 h-5 max-sm:w-[15px] max-sm:h-[15px] text-black dark:text-white" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
