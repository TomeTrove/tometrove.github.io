import Link from "next/link";
import { Project } from "../data";
import { ArrowRight, BookOpen, Library, Palette, Server, Smartphone, Globe } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Library,
  Palette,
  Server,
  Smartphone,
  Globe,
};

export function ProjectCard({ project }: ProjectCardProps) {
  const IconComponent = iconMap[project.icon] || BookOpen;

  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="group h-full bg-card rounded-lg border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-md font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.summary}
        </p>
        <div className="flex items-center text-primary text-sm font-medium">
          Learn more
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
