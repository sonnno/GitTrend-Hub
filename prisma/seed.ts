import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

const allTimeProjects = [
  {
    githubId: 21289110,
    name: "react",
    fullName: "facebook/react",
    description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    htmlUrl: "https://github.com/facebook/react",
    stargazersCount: 231456,
    forksCount: 47234,
    language: "JavaScript",
    ownerLogin: "facebook",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4",
    pushedAt: subDays(new Date(), 1),
  },
  {
    githubId: 31792824,
    name: "vue",
    fullName: "vuejs/vue",
    description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    htmlUrl: "https://github.com/vuejs/vue",
    stargazersCount: 208234,
    forksCount: 33621,
    language: "TypeScript",
    ownerLogin: "vuejs",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/6128107?v=4",
    pushedAt: subDays(new Date(), 2),
  },
  {
    githubId: 13343623,
    name: "tensorflow",
    fullName: "tensorflow/tensorflow",
    description: "An Open Source Machine Learning Framework for Everyone",
    htmlUrl: "https://github.com/tensorflow/tensorflow",
    stargazersCount: 186543,
    forksCount: 74321,
    language: "C++",
    ownerLogin: "tensorflow",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/15658638?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 2126244,
    name: "swift",
    fullName: "apple/swift",
    description: "The Swift Programming Language",
    htmlUrl: "https://github.com/apple/swift",
    stargazersCount: 67892,
    forksCount: 10234,
    language: "Swift",
    ownerLogin: "apple",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/10639145?v=4",
    pushedAt: subDays(new Date(), 3),
  },
  {
    githubId: 10270250,
    name: "go",
    fullName: "golang/go",
    description: "The Go programming language",
    htmlUrl: "https://github.com/golang/go",
    stargazersCount: 125678,
    forksCount: 17892,
    language: "Go",
    ownerLogin: "golang",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/4314092?v=4",
    pushedAt: subDays(new Date(), 1),
  },
];

const monthlyProjects = [
  {
    githubId: 12345678,
    name: "cursor-ai",
    fullName: "getcursor/cursor",
    description: "The AI-first code editor. Build software faster with AI.",
    htmlUrl: "https://github.com/getcursor/cursor",
    stargazersCount: 45678,
    forksCount: 2345,
    language: "TypeScript",
    ownerLogin: "getcursor",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/7641273?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 23456789,
    name: "claude-engineer",
    fullName: "anthropics/claude-engineer",
    description: "Claude Engineer is an interactive command-line interface that leverages the capabilities of the Claude 3.5 Sonnet model.",
    htmlUrl: "https://github.com/anthropics/claude-engineer",
    stargazersCount: 34567,
    forksCount: 1876,
    language: "Python",
    ownerLogin: "anthropics",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/11892311?v=4",
    pushedAt: subDays(new Date(), 1),
  },
  {
    githubId: 34567890,
    name: "open-interpreter",
    fullName: "OpenInterpreter/open-interpreter",
    description: "A natural language interface for computers",
    htmlUrl: "https://github.com/OpenInterpreter/open-interpreter",
    stargazersCount: 56789,
    forksCount: 3456,
    language: "Python",
    ownerLogin: "OpenInterpreter",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/142824633?v=4",
    pushedAt: subDays(new Date(), 2),
  },
  {
    githubId: 45678901,
    name: "lobe-chat",
    fullName: "lobehub/lobe-chat",
    description: "Lobe Chat - an open-source, modern-design AI chat framework.",
    htmlUrl: "https://github.com/lobehub/lobe-chat",
    stargazersCount: 42345,
    forksCount: 8765,
    language: "TypeScript",
    ownerLogin: "lobehub",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/131416903?v=4",
    pushedAt: subDays(new Date(), 0),
  },
];

const activeProjects = [
  {
    githubId: 56789012,
    name: "next.js",
    fullName: "vercel/next.js",
    description: "The React Framework for the Web",
    htmlUrl: "https://github.com/vercel/next.js",
    stargazersCount: 128456,
    forksCount: 27345,
    language: "JavaScript",
    ownerLogin: "vercel",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/14985020?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 67890123,
    name: "tauri",
    fullName: "tauri-apps/tauri",
    description: "Build smaller, faster, and more secure desktop and mobile applications with a web frontend.",
    htmlUrl: "https://github.com/tauri-apps/tauri",
    stargazersCount: 82345,
    forksCount: 2345,
    language: "Rust",
    ownerLogin: "tauri-apps",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/17983509?v=4",
    pushedAt: subDays(new Date(), 1),
  },
  {
    githubId: 78901234,
    name: "deno",
    fullName: "denoland/deno",
    description: "A modern runtime for JavaScript and TypeScript.",
    htmlUrl: "https://github.com/denoland/deno",
    stargazersCount: 98765,
    forksCount: 5432,
    language: "Rust",
    ownerLogin: "denoland",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/42048915?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 89012345,
    name: "bun",
    fullName: "oven-sh/bun",
    description: "Incredibly fast JavaScript runtime, bundler, test runner, and package manager.",
    htmlUrl: "https://github.com/oven-sh/bun",
    stargazersCount: 73456,
    forksCount: 2876,
    language: "Zig",
    ownerLogin: "oven-sh",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/104266939?v=4",
    pushedAt: subDays(new Date(), 2),
  },
];

const risingProjects = [
  {
    githubId: 90123456,
    name: "llama.cpp",
    fullName: "ggerganov/llama.cpp",
    description: "Port of Facebook's LLaMA model in C/C++",
    htmlUrl: "https://github.com/ggerganov/llama.cpp",
    stargazersCount: 67890,
    forksCount: 9876,
    language: "C++",
    ownerLogin: "ggerganov",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/1991296?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 11223344,
    name: "ollama",
    fullName: "ollama/ollama",
    description: "Get up and running with Llama 3.3, Mistral, Gemma 2, and other large language models.",
    htmlUrl: "https://github.com/ollama/ollama",
    stargazersCount: 98765,
    forksCount: 7865,
    language: "Go",
    ownerLogin: "ollama",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/151674099?v=4",
    pushedAt: subDays(new Date(), 1),
  },
  {
    githubId: 22334455,
    name: "langchain",
    fullName: "langchain-ai/langchain",
    description: "Build context-aware reasoning applications",
    htmlUrl: "https://github.com/langchain-ai/langchain",
    stargazersCount: 96543,
    forksCount: 15678,
    language: "Python",
    ownerLogin: "langchain-ai",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/126733545?v=4",
    pushedAt: subDays(new Date(), 0),
  },
  {
    githubId: 33445566,
    name: "comfyui",
    fullName: "comfyanonymous/ComfyUI",
    description: "The most powerful and modular diffusion model GUI and backend.",
    htmlUrl: "https://github.com/comfyanonymous/ComfyUI",
    stargazersCount: 54321,
    forksCount: 5678,
    language: "Python",
    ownerLogin: "comfyanonymous",
    ownerAvatarUrl: "https://avatars.githubusercontent.com/u/121283862?v=4",
    pushedAt: subDays(new Date(), 1),
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.project.deleteMany();
  await prisma.collection.deleteMany();

  const allProjects = [
    ...allTimeProjects,
    ...monthlyProjects,
    ...activeProjects,
    ...risingProjects,
  ];

  for (const project of allProjects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log(`Created ${allProjects.length} projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
