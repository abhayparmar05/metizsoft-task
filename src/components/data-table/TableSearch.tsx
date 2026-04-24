"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DEBOUNCE_MS = 350;

export function TableSearch({
  value,
  onChange,
  placeholder = "Search users…",
  className,
}: TableSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sync external resets (e.g. clear button)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setLocalValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), DEBOUNCE_MS);
  }

  function handleClear() {
    setLocalValue("");
    if (timerRef.current) clearTimeout(timerRef.current);
    onChange("");
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
