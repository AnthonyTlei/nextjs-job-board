import { z } from "zod";
import { JOB_TYPES, LOCATION_TYPES } from "./constants";

const requiredString = z.string().min(1, "Required");

const optionalString = z.string().max(500).optional();
const optionalStringShort = z.string().max(100).optional();

const numericRequiredString = z
  .string()
  .regex(/^\d+$/, "Must be a number")
  .min(1, "Required");

const companyLogoSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Invalid image file",
  )
  .refine(
    (file) => !file || file.size < 1024 * 1024 * 2,
    "File must be less than 2MB",
  );

const applicationSchema = z
  .object({
    applicationEmail: z
      .string()
      .max(100, "Must be 100 characters or less")
      .email()
      .optional()
      .or(z.literal("")),
    applicationUrl: z
      .string()
      .max(100, "Must be 100 characters or less")
      .url()
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.applicationEmail || data.applicationUrl, {
    message: "Must provide either an email or URL",
    path: ["applicationEmail"],
  });

const locationSchema = z
  .object({
    locationType: requiredString.refine(
      (val) => LOCATION_TYPES.includes(val),
      "Invalid location type",
    ),
    location: optionalStringShort,
  })
  .refine(
    (data) =>
      !data.locationType || data.locationType === "Remote" || data.location,
    {
      message: "Must provide a location for non-remote jobs",
      path: ["location"],
    },
  );

export const createJobSchema = z
  .object({
    title: requiredString.max(100, "Must be 100 characters or less"),
    type: requiredString.refine(
      (val) => JOB_TYPES.includes(val),
      "Invalid job type",
    ),
    companyName: requiredString.max(100, "Must be 100 characters or less"),
    companyLogo: companyLogoSchema.optional(),
    description: optionalString,
    salary: numericRequiredString.max(9, "Must be 9 characters or less"),
  })
  .and(applicationSchema)
  .and(locationSchema);

export const jobFilterSchema = z.object({
  query: optionalString,
  type: optionalString,
  location: optionalString,
  remote: z.coerce.boolean().optional(),
});

export type CreateJobType = z.infer<typeof createJobSchema>;
export type JobFilterType = z.infer<typeof jobFilterSchema>;
