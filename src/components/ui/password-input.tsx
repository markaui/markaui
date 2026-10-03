"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"

const strengthBarTone: Record<number, string> = {
  0: "bg-destructive",
  1: "bg-destructive",
  2: "bg-warning",
  3: "bg-success",
  4: "bg-success",
}

const strengthTextTone: Record<number, string> = {
  0: "text-destructive",
  1: "text-destructive",
  2: "text-warning",
  3: "text-success",
  4: "text-success",
}

function getStrength(value: string): { score: number; label: string } {
  let score = 0
  if (value.length >= 8) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  const labels = ["Weak", "Weak", "Fair", "Strong", "Great"]
  return { score, label: labels[score] ?? "Weak" }
}

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "type" | "value" | "onChange"> {
  /** Controlled value */
  value?: string
  /** Initial value when uncontrolled */
  defaultValue?: string
  /** Standard input change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Renders a weak / fair / strong / great strength meter under the field */
  showStrength?: boolean
}

function PasswordInput({
  value: valueProp,
  defaultValue = "",
  onChange,
  showStrength = false,
  disabled,
  className,
  ...props
}: PasswordInputProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const value = isControlled ? valueProp : internal
  const [visible, setVisible] = React.useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(event.target.value)
    onChange?.(event)
  }

  const strength = showStrength && value ? getStrength(value) : undefined

  return (
    <div data-slot="password-input" className="w-full">
      <Input
        type={visible ? "text" : "password"}
        {...props}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={className}
        trailingIcon={
          <IconButton
            type="button"
            variant="ghost"
            size="sm"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </IconButton>
        }
      />
      {strength ? (
        <div
          data-slot="password-strength"
          className="mt-2 flex items-center gap-3"
          aria-live="polite"
        >
          <div className="flex flex-1 gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-200",
                  bar < Math.max(strength.score, 1)
                    ? strengthBarTone[strength.score]
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <span
            className={cn("text-xs font-medium", strengthTextTone[strength.score])}
          >
            {strength.label}
          </span>
        </div>
      ) : null}
    </div>
  )
}

export { PasswordInput }
