'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CrudFormProps, CrudFormField } from '@/types/crud';
import { toast } from 'sonner';

export function CrudForm({ fields, initialValues = {}, onSubmit, isLoading = false, submitLabel = 'Submit' }: CrudFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: CrudFormField, value: any) => {
    setValues((prev) => ({ ...prev, [field.name]: value }));

    if (field.validation) {
      const error = field.validation(value);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [field.name]: error };
        } else {
          const { [field.name]: _, ...rest } = prev;
          return rest;
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const field of fields) {
      if (field.required && !values[field.name]) {
        setErrors((prev) => ({ ...prev, [field.name]: `${field.label} is required` }));
      }
    }

    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await onSubmit(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {field.type === 'text' && (
              <Input
                id={field.name}
                type="text"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'email' && (
              <Input
                id={field.name}
                type="email"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'password' && (
              <Input
                id={field.name}
                type="password"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'number' && (
              <Input
                id={field.name}
                type="number"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'date' && (
              <Input
                id={field.name}
                type="date"
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'textarea' && (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isLoading}
              />
            )}

            {field.type === 'select' && (
              <Select value={values[field.name] || ''} onValueChange={(value) => handleChange(field, value)}>
                <SelectTrigger id={field.name} disabled={isLoading}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'checkbox' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={values[field.name] || false}
                  onCheckedChange={(checked) => handleChange(field, checked)}
                  disabled={isLoading}
                />
                <Label htmlFor={field.name} className="cursor-pointer">
                  {field.placeholder}
                </Label>
              </div>
            )}

            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
            {errors[field.name] && <p className="text-xs text-destructive">{errors[field.name]}</p>}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Loading...' : submitLabel}
      </Button>
    </form>
  );
}
