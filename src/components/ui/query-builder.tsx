"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type QueryFieldType = "text" | "number" | "select"

export interface QueryField {
  id: string
  label: string
  type: QueryFieldType
  /** Choices for select-type fields */
  options?: string[]
}

export type QueryOperator = "contains" | "equals" | "gt" | "lt" | "eq" | "is"

export interface QueryRule {
  id: string
  field: string
  operator: QueryOperator
  value: string
}

const OPERATORS: Record<
  QueryFieldType,
  { value: QueryOperator; label: string }[]
> = {
  text: [
    { value: "contains", label: "contains" },
    { value: "equals", label: "equals" },
  ],
  number: [
    { value: "gt", label: ">" },
    { value: "lt", label: "<" },
    { value: "eq", label: "=" },
  ],
  select: [{ value: "is", label: "is" }],
}

export interface QueryBuilderProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Available fields for rules */
  fields: QueryField[]
  /** Controlled rule list */
  rules: QueryRule[]
  onChange: (rules: QueryRule[]) => void
  /** Connector badge shown between rule rows */
  match?: "AND" | "OR"
  addLabel?: string
}

function QueryBuilder({
  fields,
  rules,
  onChange,
  match = "AND",
  addLabel = "Add rule",
  className,
  ...props
}: QueryBuilderProps) {
  const counter = React.useRef(0)

  const updateRule = (id: string, patch: Partial<QueryRule>) =>
    onChange(rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)))

  const removeRule = (id: string) =>
    onChange(rules.filter((rule) => rule.id !== id))

  const addRule = () => {
    const field = fields[0]
    if (!field) return
    counter.current += 1
    onChange([
      ...rules,
      {
        id: "rule-" + counter.current,
        field: field.id,
        operator: OPERATORS[field.type][0].value,
        value: "",
      },
    ])
  }

  const handleFieldChange = (rule: QueryRule, fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    updateRule(rule.id, {
      field: fieldId,
      operator: field ? OPERATORS[field.type][0].value : "contains",
      value: "",
    })
  }

  const operatorsFor = (rule: QueryRule) => {
    const field = fields.find((f) => f.id === rule.field)
    return field ? OPERATORS[field.type] : []
  }

  const renderValue = (rule: QueryRule) => {
    const field = fields.find((f) => f.id === rule.field)
    if (!field) return null
    if (field.type === "select") {
      return (
        <Select
          value={rule.value}
          onValueChange={(value) => updateRule(rule.id, { value })}
        >
          <SelectTrigger size="sm" className="w-full sm:w-[140px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    return (
      <Input
        size="sm"
        type={field.type === "number" ? "number" : "text"}
        value={rule.value}
        placeholder={field.type === "number" ? "0" : "Type a value..."}
        onChange={(event) => updateRule(rule.id, { value: event.target.value })}
        className="w-full sm:w-[150px]"
      />
    )
  }

  return (
    <div
      data-slot="query-builder"
      className={cn(
        "bg-card rounded-xl border border-border p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {rules.length === 0 ? (
        <p className="text-muted-foreground border-border py-4 text-center text-sm">
          No rules yet — match everything. Add a rule to start filtering.
        </p>
      ) : (
        <div className="space-y-2">
          {rules.map((rule, index) => (
            <React.Fragment key={rule.id}>
              {index > 0 ? (
                <div className="flex items-center gap-2 py-0.5" aria-hidden="true">
                  <span className="bg-border h-px flex-1" />
                  <Badge variant="gold" className="font-semibold">
                    {match}
                  </Badge>
                  <span className="bg-border h-px flex-1" />
                </div>
              ) : null}
              <div
                data-slot="query-builder-row"
                className="bg-muted/30 hover:border-border flex flex-wrap items-center gap-2 rounded-lg border border-transparent p-2 transition-colors"
              >
                <Select
                  value={rule.field}
                  onValueChange={(fieldId) => handleFieldChange(rule, fieldId)}
                >
                  <SelectTrigger size="sm" className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={field.id}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={rule.operator}
                  onValueChange={(operator) =>
                    updateRule(rule.id, { operator: operator as QueryOperator })
                  }
                >
                  <SelectTrigger size="sm" className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operatorsFor(rule).map((operator) => (
                      <SelectItem key={operator.value} value={operator.value}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderValue(rule)}
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label={"Remove rule " + (index + 1)}
                  onClick={() => removeRule(rule.id)}
                  className="text-muted-foreground hover:text-destructive ml-auto"
                >
                  <X className="size-4" />
                </IconButton>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="mt-3 flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={addRule}
        >
          <Plus className="size-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  )
}

export { QueryBuilder }
