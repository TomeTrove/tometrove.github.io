import { getProjectByCategory } from "./data";
import { ProjectCard } from "./components/ProjectCard";
import { Layers } from "lucide-react";

export const metadata = {
  title: "Projects | TomeTrove",
  description: "Explore the TomeTrove ecosystem of applications and tools",
};

export default function ProjectsPage() {
  const sections = [
    {
      name: "Desktop Applications",
      description: "Native desktop applications built with Tauri for cross-platform support",
      projects: getProjectByCategory("desktop"),
    },
    {
      name: "Server & Infrastructure",
      description: "Backend services for managing and serving large collections of content",
      projects: getProjectByCategory("server"),
    },
    {
      name: "Media Server Clients",
      description: "Client applications that connect to the TomeTrove Media Server",
      projects: getProjectByCategory("msclient").reverse(),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12" style={{ maxWidth: "900px" }}>
        {/* Header Section */}
        <div className="mb-16 pb-12 border-b">
          <h1 className="text-5xl font-bold mb-4 text-foreground">Projects</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            The TomeTrove ecosystem consists of several complementary applications and tools,
            each designed to serve specific needs in creating, managing, and consuming digital
            content in the .tome format.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => {
          if (section.projects.length === 0) return null;
          return (
            <section key={section.name} className="mb-16">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">{section.name}</h2>
                </div>
                <p className="text-muted-foreground ml-9">{section.description}</p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {section.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
