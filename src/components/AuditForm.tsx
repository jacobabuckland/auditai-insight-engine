
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

type AuditFormValues = {
  page_url: string;
  goal: string;
};

type AuditFormProps = {
  onSubmit: (data: AuditFormValues) => void;
  isLoading: boolean;
};

const GOALS = [
  "Increase Add to Cart",
  "Boost Email Signups",
  "Drive Product Views",
  "Improve Trust / Social Proof",
];

const AuditForm = ({ onSubmit, isLoading }: AuditFormProps) => {
  const form = useForm<AuditFormValues>({
    defaultValues: {
      page_url: "",
      goal: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="page_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Optimization Goal</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GOALS.map((goal) => (
                    <SelectItem key={goal} value={goal}>
                      {goal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Running Audit..." : "Run Audit"}
        </Button>
      </form>
    </Form>
  );
};

export default AuditForm;
