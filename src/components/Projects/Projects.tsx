import ProjectCard, { Project } from './ProjectCard';

const projects: Project[] = [
  {
    name: 'TinyHouse',
    description:
      'Booking platform with Stripe payments, GraphQL, Google OAuth and Geolocation API.',
    technologies: [
      'React',
      'TypeScript',
      'Express',
      'MongoDB',
      'Ant Design',
      'Jest'
    ],
    github: 'https://github.com/kxnxchukwu/tinyhouse',
    live: 'https://tinyhouseapplication.herokuapp.com/'
  },
  {
    name: 'Crown Clothing',
    description:
      'E-commerce PWA with Stripe checkout, Firebase backend and serverless functions.',
    technologies: ['React', 'TypeScript', 'Redux Toolkit', 'Styled Components'],
    github: 'https://github.com/kxnxchukwu/crwn-clothing',
    live: 'https://crwnclothing-ts.netlify.app/'
  },
  {
    name: 'Linear Clone',
    description:
      'Productivity platform demonstrating scalable Next.js architecture with PostgreSQL.',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'PostgreSQL'
    ],
    github: 'https://github.com/kxnxchukwu/nextjs-fundmentals',
    live: 'https://nextjs-fundmentals.vercel.app/',
    type: 'web'
  },
  {
    name: 'Padre Ginos',
    description:
      'Pizza ordering app with real-time updates and a clean ordering flow.',
    technologies: ['React 19', 'TypeScript', 'TanStack Query', 'React Router'],
    github: 'https://github.com/kxnxchukwu/padre-ginos',
    live: 'https://padre-ginos.netlify.app/'
  },
  {
    name: 'eMatchi',
    description: 'A memory matching card game built with Svelte.',
    technologies: ['Svelte', 'TypeScript'],
    github: 'https://github.com/kxnxchukwu/ematchi',
    live: 'https://ematchi-game-six.vercel.app/'
  }
];

export default function Projects() {
  return (
    <div className="md:max-w-[520px] m-6 md:m-20 mt-[50px] lg:mt-[180px]">
      <h1 className="text-neutral-700 font-semibold pb-6">projects</h1>
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  );
}
