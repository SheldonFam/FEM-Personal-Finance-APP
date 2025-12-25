"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { COLOR_THEMES } from "@/lib/constants/constants";

interface ThemeSelectorProps {
  control: Control<any>;
  errors: FieldErrors;
  name?: string;
  availableThemes?: string[];
}

const THEME_OPTIONS = Object.entries(COLOR_THEMES).map(([name, color]) => ({
  name,
  color,
}));

export default function ThemeSelector({
  control,
  errors,
  name = "theme",
  availableThemes,
}: ThemeSelectorProps) {
  const themes = availableThemes
    ? THEME_OPTIONS.filter((t) => availableThemes.includes(t.name))
    : THEME_OPTIONS;

  return (
    <div>
      <Label className="text-xs font-bold text-muted-foreground">Theme</Label>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Theme is required" }}
        render={({ field }) => (
          <>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full h-[45px] text-sm">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.length > 0 ? (
                  themes.map((themeOption) => (
                    <SelectItem key={themeOption.name} value={themeOption.name}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: themeOption.color }}
                        />
                        {themeOption.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No themes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors[name] && (
              <p role="alert" className="text-xs text-destructive font-medium">
                {errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
