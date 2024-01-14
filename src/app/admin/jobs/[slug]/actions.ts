"use server";

import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type FormState = { error?: string } | undefined;

export const approveSubmission = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const user = await currentUser();
    if (!user) {
      throw new Error("Not Authenticated");
    }
    if (!isAdmin(user)) {
      throw new Error("Not Authorized");
    }
    await prisma.job.update({
      where: { id: jobId },
      data: { approved: true },
    });
    revalidatePath("/");
  } catch (e) {
    let message = "Unexpected error";
    if (e instanceof Error) {
      message = e.message;
    }
    return { error: message };
  }
};

export const deleteJob = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const user = await currentUser();
    if (!user) {
      throw new Error("Not Authenticated");
    }
    if (!isAdmin(user)) {
      throw new Error("Not Authorized");
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      throw new Error("Job not found");
    }
    if (job.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }
    await prisma.job.delete({ where: { id: jobId } });
    revalidatePath("/");
  } catch (e) {
    let message = "Unexpected error";
    if (e instanceof Error) {
      message = e.message;
    }
    return { error: message };
  } finally {
    redirect("/admin");
  }
};
