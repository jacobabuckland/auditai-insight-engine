
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
  FormDescription,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export type AuditFormValues = {
  page_url: string;
  goal: string;
  shopify_page: string;
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

const SHOPIFY_PAGES = [
  { label: "Homepage", value: "https://yourstore.myshopify.com/" },
  { label: "Collections Page", value: "https://yourstore.myshopify.com/collections/all" },
  { label: "Product Page", value: "https://yourstore.myshopify.com/products/sample-product" },
  { label: "Cart Page", value: "https://yourstore.myshopify.com/cart" },
  { label: "Checkout", value: "https://yourstore.myshopify.com/checkout" },
  { label: "Blog", value: "https://yourstore.myshopify.com/blogs/news" },
  { label: "Contact Us", value: "https://yourstore.myshopify.com/pages/contact" },
  { label: "About Us", value: "https://yourstore.myshopify.com/pages/about" },
];

const AuditForm = ({ onSubmit, isLoading }: AuditFormProps) => {
  const form = useForm<AuditFormValues>({
    defaultValues: {
      shopify_page: "",
      goal: "",
    },
  });

  const handleSubmit = (data: AuditFormValues) => {
    // Use the selected Shopify page as the page_url
    data.page_url = data.shopify_page;
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="shopify_page"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Page</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page from your store" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {SHOPIFY_PAGES.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a page from your Shopify store to audit.
              </FormDescription>
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
                    <SelectValue placeholder="What is your CRO goal?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
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
          className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Auditing page...
            </>
          ) : (
            "Run Audit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AuditForm;
