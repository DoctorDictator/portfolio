# DoctorDictator — Portfolio

A fast, modern portfolio site built primarily with TypeScript. This repository contains the source for a personal portfolio showcasing projects, writing, and contact information.

Why this repo
- Strongly typed codebase (TypeScript-first) for reliability and maintainability.
- Focus on performance and accessibility for a small, fast personal site.
- Clean, component-based architecture so content and layout are easy to update.

Features
- Responsive layout for desktop and mobile.
- Project gallery / case studies.
- Contact / social links.
- SEO-friendly metadata.
- Theme / color variables via SCSS (or CSS modules depending on implementation).
- Build scripts for development and production.

Built with (typical)
- TypeScript
- React, Preact, or another modern UI library (project uses TypeScript; adapt commands below to the stack actually used)
- Vite, Next.js, or another bundler/framework
- SCSS / CSS modules for styling

Getting started (local)
1. Clone the repo
   git clone https://github.com/DoctorDictator/portfolio.git
2. Install dependencies
   npm install
   or
   yarn
3. Run the dev server
   npm run dev
   or
   yarn dev

Common scripts
(Adjust these to match the scripts in package.json if they differ)
- npm run dev — start local development server
- npm run build — create a production build
- npm run preview — preview the production build locally
- npm run lint — run linters
- npm test — run tests (if any)

Configuration & environment
- If the site uses environment variables (for example to load CMS data or analytics), add a `.env.local` file (or the appropriate env file for your framework) with the required keys. See the code for which variables are expected.
- Theme and site content are typically stored in src/ (components, pages, data). Update those files to change copy or add projects.

Deployment
- This project can be deployed to Vercel, Netlify, GitHub Pages, or any static hosting that supports your chosen framework:
  - Vercel: connect the repository and set the build command (e.g., npm run build) and output directory (e.g., .vercel/output or dist).
  - Netlify: set the build command and publish directory.
  - GitHub Pages: build locally and push the generated static files to the gh-pages branch (or use actions to automate).

Notes / Tips
- Keep content (project list, skills, links) in a single data file to make updates easier.
- Use image optimization for portfolio thumbnails to keep load performance high.
- Add accessibility checks (axe, Lighthouse) and run them during CI.

Contributing
- Changes that improve correctness, performance, accessibility, or content are welcome.
- If you plan to make larger changes, open an issue first to discuss the design and approach.
- Fork, create a branch, and open a pull request with a clear description of the change.

License
- Unless otherwise specified in a LICENSE file in the repo, please check the repository for a license. If there isn't one and you plan to reuse or contribute, open an issue to clarify licensing.

Contact
- Repo: https://github.com/DoctorDictator/portfolio
- Author: DoctorDictator

If you'd like, I can:
- generate a concise CONTRIBUTING.md,
- produce a GitHub Actions workflow for build & deploy,
- or tailor the README to the exact framework (Next/Vite) used in this repo — tell me which one and I'll update the docs.
