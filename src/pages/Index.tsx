import { useEffect } from "react";
import ProjectCreator from "@/components/ProjectCreator";

const Index = () => {
  useEffect(() => {
    document.title = "Project Creator – Pixel-Perfect UI";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Create projects with status, priority, dates, labels and milestones in a polished modal.");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Project Creator</h1>
        <p className="text-muted-foreground max-w-prose mx-auto">A pixel-perfect modal with status, priority, member, date pickers, labels, dependencies and milestones—faithful to your reference.</p>
        <div className="flex items-center justify-center gap-4">
          <ProjectCreator />
        </div>
      </section>
    </main>
  );
};

export default Index;
