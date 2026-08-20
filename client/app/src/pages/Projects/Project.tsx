import { useState, useEffect } from "react";
import { useParams } from "react-router";

interface projectData {
  project_id: number;
  title: string;
  description: string;
}

export default function Project() {
  const [projectData, setProjectData] = useState<projectData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
const { id } = useParams();


  async function getProject() {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/v1/projects/${id}`);

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
    getProject();
  }, []);

  if (loading) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  return (
    <section className="flex flex-col gap-20">
      <div>
        <a href="/projects/">Back to Projects</a>
      </div>
      {projectData.map((project, index) => (
        <h2>{project.title}</h2>
      ))}
    </section>
  );
}
