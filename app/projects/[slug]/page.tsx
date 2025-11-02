import { projects } from "../data";
import Link from "next/link";
import { ArrowLeft, Code2, Zap, Download, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} | TomeTrove Projects`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  const getCategoryColor = (category: string | string[]) => {
    const cat = typeof category === "string" ? category : category[0];
    switch (cat) {
      case "desktop":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "mobile":
        return "bg-purple-500/10 text-purple-700 border-purple-200";
      case "server":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "msclient":
        return "bg-green-500/10 text-green-700 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string | string[]) => {
    const cat = typeof category === "string" ? category : category[0];
    const labels: Record<string, string> = {
      desktop: "Desktop",
      mobile: "Mobile",
      server: "Server",
      msclient: "Media Server Client",
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto px-4" style={{ maxWidth: "900px" }}>
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header Section */}
        <div className="">
          {/* Category Badge */}
          <div className="mb-4 flex flex-wrap gap-2">
            {typeof project.category === "string" ? (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                  project.category
                )}`}
              >
                {getCategoryLabel(project.category)}
              </span>
            ) : (
              project.category.map((cat) => (
                <span
                  key={cat}
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    cat
                  )}`}
                >
                  {getCategoryLabel(cat)}
                </span>
              ))
            )}
          </div>

          {/* Title */}
        </div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-4 text-foreground">{project.name}</h1>
          <p className="text-foreground leading-relaxed text-base text-justify">
            {project.fullDescription}
          </p>
        </div>

        {/* Tech Stack Section */}
        {project.techStack && project.techStack.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Repository Info */}
        {project.repo.show === true && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Repository</h2>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">GitHub Repo</p>
                  <p className="font-mono text-sm text-foreground">{project.repo.name}</p>
                </div>
                {project.repo.url && (
                  <a
                    href={project.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Versions Section */}
        {project.versions && project.versions.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Download className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Downloads</h2>
            </div>
            <div className="space-y-4">
              {project.versions.map((version, idx) => (
                <div key={idx} className="bg-card rounded-lg border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">v{version.version}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{version.releaseDate}</p>
                    </div>
                  </div>

                  {version.notes && (
                    <p className="text-sm text-foreground mb-4">{version.notes}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {version.downloads.map((download, downloadIdx) => (
                      <a
                        key={downloadIdx}
                        href={download.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        {download.platform}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        
      </div>
    </div>
  );
}
