
import React, { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export type AuditFormValues = {
  page_url: string;
  goal: string;
  source_type: "manual" | "shopify";
  shopify_page?: string;
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

const MOCK_SHOPIFY_PAGES = [
  { label: "Homepage", value: "https://yourstore.myshopify.com/" },
  { label: "Collections Page", value: "https://yourstore.myshopify.com/collections/all" },
  { label: "Product Page", value: "https://yourstore.myshopify.com/products/hoodie" },
  { label: "Cart Page", value: "https://yourstore.myshopify.com/cart" },
];

const AuditForm = ({ onSubmit, isLoading }: AuditFormProps) => {
  const [sourceType, setSourceType] = useState<"manual" | "shopify">("manual");

  const form = useForm<AuditFormValues>({
    defaultValues: {
      page_url: "",
      goal: "",
      source_type: "manual",
    },
  });

  const handleSubmit = (data: AuditFormValues) => {
    // Add the source type to the form data
    data.source_type = sourceType;
    
    // If using Shopify selector, use the selected page URL
    if (sourceType === "shopify" && data.shopify_page) {
      data.page_url = data.shopify_page;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full max-w-md mx-auto"
      >
        <Tabs
          defaultValue="manual"
          onValueChange={(value) => setSourceType(value as "manual" | "shopify")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual URL</TabsTrigger>
            <TabsTrigger value="shopify">Shopify Page</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <FormField
              control={form.control}
              name="page_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourstore.com/"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="shopify" className="space-y-4">
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
                    <SelectContent>
                      {MOCK_SHOPIFY_PAGES.map((page) => (
                        <SelectItem key={page.value} value={page.value}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a page from your connected Shopify store.
                  </FormDescription>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

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
