"use client";

import { Control, FieldErrors } from "react-hook-form";
import FormSelect from "@/components/Modals/shared/FormSelect";
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

const NO_THEMES_OPTION = [{ value: "none", label: "No themes available", disabled: true }];

export default function ThemeSelector({
  control,
  errors,
  name = "theme",
  availableThemes,
}: ThemeSelectorProps) {
  const availableSet = availableThemes ? new Set(availableThemes) : null;
  const themes = availableSet
    ? THEME_OPTIONS.filter((t) => availableSet.has(t.name))
    : THEME_OPTIONS;

  const options =
    themes.length > 0
      ? themes.map((theme) => ({
          value: theme.name,
          label: theme.name,
          renderContent: () => (
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
              {theme.name}
            </div>
          ),
        }))
      : NO_THEMES_OPTION;

  return (
    <FormSelect
      control={control}
      errors={errors}
      name={name}
      label="Theme"
      placeholder="Select a theme"
      options={options}
      requiredMessage="Theme is required"
    />
  );
}
