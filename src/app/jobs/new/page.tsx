import { Metadata } from "next";
import NewJobForm from "./new-job-form";
import H1 from "@/components/ui/h1";

export const metadata: Metadata = {
  title: "Post a new Job",
};

const NewJobPage = () => {
  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Find a suitable developer</H1>
        <p className="text-muted-foreground">
          Get your job posting in front of the right people.
        </p>
      </div>
      <NewJobForm />
    </main>
  );
};

export default NewJobPage;
