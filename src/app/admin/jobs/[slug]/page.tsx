import { notFound } from "next/navigation";
import JobDetails from "@/components/job-details";
import prisma from "@/lib/prisma";
import AdminSidebar from "./admin-sidebar";

interface JobPageProps {
  params: { slug: string };
}

const JobPage = async ({ params: { slug } }: JobPageProps) => {
  const job = await prisma.job.findUnique({
    where: { slug },
  });

  if (!job) notFound();

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobDetails job={job} />
      <AdminSidebar job={job} />
    </main>
  );
};

export default JobPage;
