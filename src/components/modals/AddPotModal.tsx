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

interface AddPotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; target: number; theme: string }) => void;
  existingPots?: Array<{ name: string; theme: string }>;
}

const POT_THEMES = [
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

export function AddPotModal({
  open,
  onOpenChange,
  onSubmit,
  existingPots = [],
}: AddPotModalProps) {
  const [name, setName] = React.useState<string>("");
  const [target, setTarget] = React.useState<string>("");
  const [theme, setTheme] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && target && theme) {
      onSubmit({
        name,
        target: parseFloat(target),
        theme,
      });
      // Reset form
      setName("");
      setTarget("");
      setTheme("");
      onOpenChange(false);
    }
  };

  const usedThemes = existingPots.map((pot) => pot.theme);
  const availableThemes = POT_THEMES.filter(
    (t) => !usedThemes.includes(t.name)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-5 sm:p-8">
        <DialogHeader className="space-y-5">
          <DialogTitle className="text-[32px] font-bold text-foreground">
            Add New Pot
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a pot to set savings targets. These can help keep you on
            track as you save for special purchases.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Pot Name
            </Label>
            <Input
              type="text"
              placeholder="e.g. Rainy Days"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[45px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold text-muted-foreground">
              Target
            </Label>
            <Input
              type="number"
              prefix="$"
              placeholder="e.g. 2000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="h-[45px]"
              min="0"
              step="0.01"
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
                {availableThemes.length > 0 ? (
                  availableThemes.map((themeOption) => (
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
          </div>

          <Button
            type="submit"
            className="w-full h-[53px] text-sm font-bold mt-8"
            disabled={!name || !target || !theme}
          >
            Add Pot
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
