"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";

interface EditBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: {
    category: string;
    maxSpend: number;
    theme: string;
  } | null;
  onSubmit: (data: {
    category: string;
    maxSpend: number;
    theme: string;
  }) => void;
}

const BUDGET_CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
];

const BUDGET_THEMES = [
  { name: "Green", color: "#277C78" },
  { name: "Yellow", color: "#F2CDAC" },
  { name: "Cyan", color: "#82C9D7" },
  { name: "Navy", color: "#626070" },
  { name: "Red", color: "#C94736" },
  { name: "Purple", color: "#826CB0" },
  { name: "Turquoise", color: "#597C7C" },
  { name: "Brown", color: "#93674F" },
  { name: "Magenta", color: "#934F6F" },
  { name: "Blue", color: "#3F82B2" },
  { name: "Navy Grey", color: "#97A0AC" },
  { name: "Army Green", color: "#7F9161" },
  { name: "Pink", color: "#AF81BA" },
  { name: "Gold", color: "#CAB361" },
  { name: "Orange", color: "#BE6C49" },
];

export function EditBudgetModal({
  open,
  onOpenChange,
  budget,
  onSubmit,
}: EditBudgetModalProps) {
  const [category, setCategory] = React.useState<string>("");
  const [maxSpend, setMaxSpend] = React.useState<string>("");
  const [theme, setTheme] = React.useState<string>("");

  React.useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setMaxSpend(budget.maxSpend.toString());
      setTheme(budget.theme);
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && maxSpend && theme) {
      onSubmit({
        category,
        maxSpend: parseFloat(maxSpend),
        theme,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Edit Budget
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            As your budgets change, feel free to update your spending limits.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Budget Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-[45px] text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Maximum Spend
            </Label>
            <Input
              type="number"
              prefix="$"
              placeholder="e.g. 2000"
              value={maxSpend}
              onChange={(e) => setMaxSpend(e.target.value)}
              className="h-[45px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full h-[45px] text-sm">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_THEMES.map((themeOption) => (
                  <SelectItem key={themeOption.name} value={themeOption.name}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: themeOption.color }}
                      />
                      {themeOption.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-[53px] text-sm font-bold mt-8"
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
