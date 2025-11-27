'use client'

import React from 'react'
import { Input } from './input'
import { Button } from './button'

export interface CustomField {
  id: string
  label: string
  value: string
  type: 'text' | 'number' | 'date' | 'email' | 'url' | 'tel'
}

interface CustomFieldsProps {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
  maxFields?: number
}

export function CustomFields({ fields, onChange, maxFields = 10 }: CustomFieldsProps) {
  const addField = () => {
    if (fields.length >= maxFields) return
    const newField: CustomField = {
      id: `custom_${Date.now()}`,
      label: '',
      value: '',
      type: 'text',
    }
    onChange([...fields, newField])
  }

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id))
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'tel', label: 'Phone' },
  ]

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2 rounded-lg border border-black/[0.08] bg-black/[0.02] p-3">
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Field name"
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="flex-1 text-sm"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(field.id, { type: e.target.value as CustomField['type'] })}
                className="rounded-md border border-black/20 bg-white px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type={field.type}
              placeholder={`Enter ${field.label || 'value'}`}
              value={field.value}
              onChange={(e) => updateField(field.id, { value: e.target.value })}
              className="text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => removeField(field.id)}
            className="mt-1 rounded-md p-1.5 text-black/40 hover:bg-black/[0.04] hover:text-danger transition-colors"
            aria-label={`Remove ${field.label || 'custom field'}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {fields.length < maxFields && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addField}
          className="w-full border-dashed"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Custom Field
        </Button>
      )}

      {fields.length === 0 && (
        <p className="text-center text-xs text-black/50 py-2">
          Add custom fields to capture additional information specific to your needs
        </p>
      )}
    </div>
  )
}

// Helper to serialize custom fields for storage
export function serializeCustomFields(fields: CustomField[]): Record<string, { value: string; type: string }> {
  return fields.reduce((acc, field) => {
    if (field.label.trim()) {
      acc[field.label] = { value: field.value, type: field.type }
    }
    return acc
  }, {} as Record<string, { value: string; type: string }>)
}

// Helper to deserialize custom fields from storage
export function deserializeCustomFields(data: Record<string, { value: string; type: string }> | undefined): CustomField[] {
  if (!data) return []
  return Object.entries(data).map(([label, { value, type }], index) => ({
    id: `custom_${index}_${Date.now()}`,
    label,
    value,
    type: type as CustomField['type'],
  }))
}
