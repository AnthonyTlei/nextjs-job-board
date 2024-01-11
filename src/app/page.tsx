import JobFilterSidebar from "@/components/job-filter-sidebar";
import JobResults from "@/components/job-results";
import H1 from "@/components/ui/h1";
import { JobFilterType } from "@/lib/validation";
import { Metadata } from "next";
import { title } from "process";

interface HomeProps {
  searchParams: {
    query?: string;
    type?: string;
    location?: string;
    remote?: string;
  };
}

const getTitle = ({ query, type, location, remote }: JobFilterType) => {
  const titlePrefix = query
    ? `${query} jobs`
    : type
      ? `${type} jobs`
      : remote
        ? "Remote jobs"
        : "All jobs";
  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
};

export const generateMetadata = ({
  searchParams: { query, type, location, remote },
}: HomeProps): Metadata => {
  return {
    title: `${getTitle({
      query,
      type,
      location,
      remote: remote === "true",
    })} | Easy Jobs`,
  };
};

export default async function Home({
  searchParams: { query, type, location, remote },
}: HomeProps) {
  const filterValues: JobFilterType = {
    query: query,
    type: type,
    location: location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>{getTitle(filterValues)}</H1>
        <p>Find your next job.</p>
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar defaultValues={filterValues} />
        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
