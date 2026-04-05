import ExperienceItem from './ExperienceItem';
import { experienceData } from './data';

export default function Experience() {
  return (
    <div className="md:max-w-[420px] m-6 md:m-20 mt-[50px] lg:mt-[180px]">
      <h1 className="text-neutral-700 font-semibold pb-6">work</h1>
      {experienceData.map(
        ({ yearRange, role, company, description, technologies }, index) => (
          <ExperienceItem
            key={index}
            yearRange={yearRange}
            role={role}
            company={company}
            description={description}
            technologies={technologies}
          />
        )
      )}
    </div>
  );
}
