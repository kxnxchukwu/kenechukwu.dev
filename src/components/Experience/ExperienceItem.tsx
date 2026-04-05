interface ExperienceItemProps {
  yearRange: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
}

export default function ExperienceItem({
  yearRange,
  role,
  company,
  description,
  technologies
}: Readonly<ExperienceItemProps>) {
  return (
    <div className="mb-4">
      <p className="text-xs text-neutral-400 pb-1">{yearRange}</p>
      <h2 className="text-neutral-700 font-semibold">
        {role} <span className="text-neutral-400 font-[380]">at {company}</span>
      </h2>
      <p className="leading-[25px] pt-2 pb-3 text-neutral-500 font-[380] w-11/12">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-1">
        {technologies.map((tech) => (
          <span
            className="m-1"
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
