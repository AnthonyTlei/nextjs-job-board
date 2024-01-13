"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateJobType, createJobSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { JOB_TYPES, LOCATION_TYPES } from "@/lib/constants";
import Select from "@/components/ui/select";
import { X } from "lucide-react";
import LocationInput from "@/components/location-input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/rich-text-editor";
import { draftToMarkdown } from "markdown-draft-js";
import LoadingButton from "@/components/loading-button";

const NewJobForm = () => {
  const form = useForm<CreateJobType>({
    resolver: zodResolver(createJobSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: CreateJobType) => {
    console.log(JSON.stringify(values, null, 2));
  };

  return (
    <div className="space-y-6 rounded-lg border p-4">
      <div>
        <h2 className="font-semibold">Job Details</h2>
        <p className="text-muted-foreground">Provide a job description</p>
      </div>
      <Form {...form}>
        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Frontend Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job type</FormLabel>
                <FormControl>
                  <Select {...field} defaultValue="">
                    <option value="" hidden>
                      Select an option
                    </option>
                    {JOB_TYPES.map((jobType) => (
                      <option key={jobType} value={jobType}>
                        {jobType}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyLogo"
            render={({ field: { value, ...fieldValues } }) => (
              <FormItem>
                <FormLabel>Company logo</FormLabel>
                <FormControl>
                  <Input
                    {...fieldValues}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      fieldValues.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Type</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    defaultValue=""
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.currentTarget.value === "Remote") {
                        trigger("location");
                      }
                    }}
                  >
                    <option value="" hidden>
                      Select an option
                    </option>
                    {LOCATION_TYPES.map((locationType) => (
                      <option key={locationType} value={locationType}>
                        {locationType}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office location</FormLabel>
                <FormControl>
                  <LocationInput
                    placeholder="e.g. London, United Kingdom"
                    onLocationSelected={field.onChange}
                    ref={field.ref}
                  />
                </FormControl>
                {watch("location") && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setValue("location", "", { shouldValidate: true });
                      }}
                    >
                      <X size={20} />
                    </button>
                    <span className="text-sm">{watch("location")}</span>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="applicationEmail">How to apply</Label>
            <div className="flex justify-between">
              <FormField
                control={control}
                name="applicationEmail"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <div className="flex items-center">
                        <Input
                          id="applicationEmail"
                          placeholder="Email"
                          type="email"
                          {...field}
                        />
                        <span className="mx-2">or</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="applicationUrl"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormControl>
                      <Input
                        placeholder="Website URL"
                        type="url"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          trigger("applicationEmail");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label onClick={() => setFocus("description")}>
                  Description
                </Label>
                <FormControl>
                  <RichTextEditor
                    onChange={(draft) => field.onChange(draftToMarkdown(draft))}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default NewJobForm;
