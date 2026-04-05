import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  type?: 'web' | 'data';
}

export default function ProjectCard({
  project
}: Readonly<{ project: Project }>) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 pb-1">
        <h2 className="text-neutral-700 font-semibold">{project.name}</h2>
        <div className="flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-neutral-600 transition-colors"
              aria-label={`${project.name} GitHub`}
            >
              <GitHubIcon style={{ fontSize: 15 }} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-neutral-600 transition-colors"
              aria-label={`${project.name} live site`}
            >
              <OpenInNewIcon style={{ fontSize: 15 }} />
            </a>
          )}
        </div>
      </div>
      <p className="leading-[25px] pb-3 text-neutral-500 font-[380] text-sm w-11/12">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: '11px',
              color: '#737373',
              background: '#e5e5e5',
              borderRadius: '999px',
              padding: '3px 10px',
              whiteSpace: 'nowrap',
              margin: '2px'
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
