type Cat = "desktop" | "mobile" | "server" | "msclient";

export interface ProjectVersion {
  version: string;
  releaseDate: string;
  downloads: {
    platform: string;
    url: string;
  }[];
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  icon: string;
  repo: {
    name: string;
    url?: string;
    show?: boolean;
  };
  category: Cat | Cat[];
  summary: string;
  description: string;
  fullDescription: string;
  techStack?: string[];
  versions?: ProjectVersion[];
  links?: {
    label: string;
    url: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "reader-tauri-lite",
    name: "TomeTrove Desktop Tauri Reader Lite",
    slug: "reader-tauri-lite",
    icon: "BookOpen",
    repo: {
      name: "reader-tauri-lite",
    },
    category: "desktop",
    summary:
      "A lightweight desktop application for reading individual .tome files. Simple, focused, and easy to use.",
    description:
      "A lightweight desktop reader built with Tauri that focuses on reading a single .tome file. Perfect for users who want a simple, focused reading experience without library management features.",
    fullDescription:
      "Reader Lite is a lightweight desktop application built with Tauri that provides a focused experience for reading individual .tome files. Designed for users who want a simple, straightforward reader without the additional complexity of library management. Ideal for quick access to specific tome files.",
    techStack: ["Tauri", "React", "TypeScript"],
    versions: [
      {
        version: "0.1.0",
        releaseDate: "November 2, 2025",
        notes: "First test release",
        downloads: [
          { platform: "Windows", url: "https://github.com/TomeTrove/reader-tauri-lite/releases/download/v0.1.0/tauridesktopreaderlite_0.1.0_x64-setup_windows.exe" },
        ],
      },
    ]
  },
  {
    id: "reader-tauri",
    name: "TomeTrove Desktop Tauri Reader",
    slug: "reader-tauri",
    icon: "Library",
    repo: {
      name: "reader-tauri",
    },
    category: ["desktop", "msclient"],
    summary: "A full-featured desktop reader with library management, remote library support, and unified browsing.",
    description:
      "A comprehensive desktop reader that lets you add remote libraries from media servers, manage local and remote libraries, browse a unified homepage listing series and books, and search through your libraries by metadata.",
    fullDescription:
      "Reader is a full-featured desktop application that provides complete library management capabilities. Add remote libraries published by media servers, view and manage both local and remote libraries, download remote .tome files into your local collection, and browse a unified homepage that intelligently combines series and books. The app shows where content comes from (local or remote) and includes powerful metadata search capabilities.",

    techStack: ["Tauri", "React", "TypeScript"],
  },
  {
    id: "studio-tauri",
    name: "TomeTrove Desktop Tauri Studio",
    slug: "studio-tauri",
    icon: "Palette",
    repo: {
      name: "studio-tauri",
      url: "https://github.com/tometrove/studio-tauri",
      show: false,
    },
    category: "desktop",
    summary:
      "A comprehensive creator suite for making, editing, publishing, and converting digital content into the .tome format.",
    description:
      "A comprehensive desktop application for creating, editing, publishing, and converting digital content into the .tome format. Built with Tauri for cross-platform support.",
    fullDescription:
      "Studio is a comprehensive desktop application designed for creators to make, edit, convert digital content into the .tome format. It combines creation, editing, and format conversion capabilities in a single integrated environment with seamless workflows.",

    techStack: ["Tauri", "React", "TypeScript"],
    // versions: [
    //   {
    //     version: "1.0.0",
    //     releaseDate: "November 1, 2025",
    //     downloads: [
    //       { platform: "Windows", url: "https://github.com/..." },
    //       { platform: "macOS", url: "https://github.com/..." },
    //       { platform: "Linux", url: "https://github.com/..." },
    //     ],
    //     notes: "Initial release with core features"
    //   },
    //   {
    //     version: "0.9.0-beta",
    //     releaseDate: "October 15, 2025",
    //     downloads: [
    //       { platform: "Windows", url: "https://github.com/..." },
    //     ],
    //   },
    // ]
  },
  {
    id: "server-media",
    name: "TomeTrove Media Server",
    slug: "server-media",
    icon: "Server",
    repo: {
      name: "server-media",
      url: "https://github.com/...",
      show:false,
    },
    category: "server",
    summary:
      "A central manager for large tome file libraries that enables access and sharing from anywhere with companion apps.",
    description:
      "The Media Server is a central manager for large libraries of .tome files. It makes accessing large collections easy with complementary apps for desktop and mobile, enabling you to access your whole library from anywhere.",
    fullDescription:
      "The Media Server acts as a central hub for managing large libraries of .tome files. While native apps handle local file management well, the Media Server solves the problem of consuming large collections. It enables easy access from anywhere using companion desktop and mobile apps. Creators can provide remote libraries for supporters, making content discoverable in a central stream while providing great promotion opportunities.",
   
    techStack: ["Node.js", "Express", "TypeScript"],
  },
  {
    id: "msclient-expo",
    name: "TomeTrove Mobile MSClient",
    slug: "msclient-expo",
    icon: "Smartphone",
    repo: {
      name: "msclient-expo",
    },
    category: ["msclient", "mobile"],
    summary: "A cross-platform mobile app for Android and iOS to browse and read from your self-hosted Media Server.",
    description:
      "A cross-platform mobile application for Android and iOS built with React Native Expo. Connects to a self-hosted version of the TomeTrove Media Server to access and read your collection on the go.",
    fullDescription:
      "MSClient Expo is a cross-platform mobile application built with React Native Expo, available for both Android and iOS. It connects to your self-hosted TomeTrove Media Server, giving you access to your entire collection from your mobile device.",
    
    techStack: ["React Native", "Expo", "TypeScript"],
  },
  {
    id: "msclient-site",
    name: "TomeTrove Website MSClient",
    slug: "msclient-site",
    icon: "Globe",
    repo: {
      name: "msclient-site",
    },
    category: "msclient",
    summary: "A web-based client to browse and read from your self-hosted Media Server, accessible from any browser.",
    description:
      "A website version of the MSClient that runs in your browser. Connects to a self-hosted version of the TomeTrove Media Server, giving you web-based access to your collection.",
    fullDescription:
      "MSClient Site is a web-based client that provides browser access to your self-hosted TomeTrove Media Server. Access your collection from any device with a web browser, with the convenience of web-based reading and library browsing.",
    
    techStack: ["React", "TypeScript", "Tailwind CSS"],
  },
];

export function getProjectByCategory(cat: Cat) {
  return projects.filter((p) => testCat(p.category, cat))
}


function testCat(cat: Cat | Cat[], val:Cat) {
  return typeof cat === "string" ? cat === val : cat.includes(val)
}