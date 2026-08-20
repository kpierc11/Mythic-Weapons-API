import { useState, useEffect } from "react";

interface projectData {
  project_id: number;
  title: string;
  description: string;
}

export default function Projects() {
  const [projectData, setProjectData] = useState<projectData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getProjects() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/v1/projects/");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const result = await response.json();

      console.log(result);

      setProjectData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return (
    <section className="flex flex-row gap-20">
      {projectData.map((project, index) => (
        <div key={index} className="card border-1 border-primary bg-base-100 w-96 shadow-lg">
          {/* <figure>
            <img style={{minHeight:350, maxHeight:350, objectFit:"cover", width:"100%"}}
              src={project.image_url}
              alt={project.name}
            />
          </figure> */}

          <div className="card-body">
            <h2 className="card-title">{project.title}</h2>

            <h2 className="font-bold">Description:</h2>
            <p>{project.description}</p>

            <div className="card-actions justify-end">
              <a className="btn btn-primary" href={`/projects/${project.project_id}`}>View Project</a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}