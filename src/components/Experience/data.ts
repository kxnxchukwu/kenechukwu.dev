export interface ExperienceEntry {
  yearRange: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
}

export type ExperienceData = ExperienceEntry[];

export const experienceData: ExperienceData = [
  {
    yearRange: 'August 2022 - present',
    role: 'Frontend Engineer',
    company: 'Poppulo',
    description:
      "Build and maintain essential components used to construct Poppulo's digital signage frontend. Work closely with cross-functional teams.",
    technologies: ['JavaScript', 'TypeScript', 'React', 'Redux Toolkit']
  },
  {
    yearRange: 'January 2022 - June 2022',
    role: 'Frontend Engineer',
    company: 'bxp software',
    description:
      "Maintain, flesh new features, and ship bxp's CRM cloud based system for a diverse array of clients.",
    technologies: ['JavaScript', 'HTML & CSS', 'React']
  },
  {
    yearRange: 'September 2020 - March 2022',
    role: 'Computing Lab Assistant',
    company: 'National College of Ireland',
    description:
      'Assisted lecturers and supported students with computing tutorials. Provided technical support to students and staff in the computing lab.',
    technologies: [
      'Python',
      'R',
      'Data Mining',
      'Machine Learning',
      'Data Analytical Programming'
    ]
  },
  {
    yearRange: 'January 2019 - December 2019',
    role: 'Junior Software Developer',
    company: 'Chams Plc',
    description:
      'Worked alongside a team to develop web applications for in-house and clients, adhering to best practices in Agile and QA.',
    technologies: ['HTML & CSS', 'JavaScript', 'React', 'SQL', '.NET Core']
  }
];
