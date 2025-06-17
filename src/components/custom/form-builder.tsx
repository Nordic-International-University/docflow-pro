"use client";

import type * as React from "react";
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: SelectOption[];
  className?: string;
}

interface FormBuilderProps<T extends FieldValues> {
  fields: FormFieldConfig[];
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  submitText?: string;
  loading?: boolean;
  className?: string;
  children?: (form: UseFormReturn<T>) => React.ReactNode;
}

export function FormBuilder<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = "Submit",
  loading = false,
  className,
  children,
}: FormBuilderProps<T>) {
  const form = useForm<T>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const renderField = (field: FormFieldConfig) => {
    const {
      name,
      label,
      type,
      placeholder,
      description,
      options,
      className: fieldClassName,
    } = field;

    return (
      <FormField
        key={name}
        control={form.control}
        name={name as Path<T>}
        render={({ field: formField }) => (
          <FormItem className={fieldClassName}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {type === "text" ||
              type === "email" ||
              type === "password" ||
              type === "number" ? (
                <Input type={type} placeholder={placeholder} {...formField} />
              ) : type === "textarea" ? (
                <Textarea placeholder={placeholder} {...formField} />
              ) : type === "select" ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={name}
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                  <Label htmlFor={name}>{label}</Label>
                </div>
              ) : type === "radio" ? (
                <RadioGroup
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  className="flex flex-col space-y-1"
                >
                  {options?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : null}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-6", className)}
      >
        {fields.map(renderField)}

        {children && children(form)}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : submitText}
        </Button>
      </form>
    </Form>
  );
}
