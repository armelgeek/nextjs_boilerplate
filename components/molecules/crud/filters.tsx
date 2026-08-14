import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CrudFiltersProps } from '@/types/crud';
import { IconX } from '@tabler/icons-react';

export function CrudFilters({ filters, config, onFilterChange, onReset }: CrudFiltersProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {config.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>

            {field.type === 'text' && (
              <Input
                placeholder={field.placeholder}
                value={filters[field.key] || ''}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
              />
            )}

            {field.type === 'select' && (
              <Select value={filters[field.key] || ''} onValueChange={(value) => onFilterChange(field.key, value)}>
                <SelectTrigger>
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
                  id={field.key}
                  checked={filters[field.key] || false}
                  onCheckedChange={(checked) => onFilterChange(field.key, checked)}
                />
                <label htmlFor={field.key} className="text-sm cursor-pointer">
                  {field.placeholder}
                </label>
              </div>
            )}

            {field.type === 'date' && (
              <Input
                type="date"
                value={filters[field.key] || ''}
                onChange={(e) => onFilterChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full md:w-auto"
        >
          <IconX className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
