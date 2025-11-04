import { VStack, Section } from './components';
import { Project } from './getProjects';

export default function RecProjClient({ projects }: { projects: Project[] }) {
  return (
    <Section className="bg-foreground rounded-[30px] max-w-4xl items-center py-6">
      <VStack>
        <p className="md:text-5xl sm:text-4xl text-3xl font-bold text-blue-500">
          Recent Projects
        </p>
        <div className="space-y-4">
          {projects.map((project, i) => (
            <div key={i} className="p-4 border rounded">
              <h2 className="font-semibold">{project.title}</h2>
              <p>Type: {project.type}</p>
              <p>Languages: {project.languages.join(', ')}</p>
              <div className="flex gap-2 mt-2">
                {project.photos.map((url, j) => (
                  <img
                    key={j}
                    src={url}
                    alt={`${project.title} screenshot`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </VStack>
    </Section>
  );
}
