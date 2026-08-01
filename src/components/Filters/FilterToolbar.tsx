"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  CATEGORY_FILTER_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constants/constants";
import type { CategoryFilter, SortOption } from "@/lib/types";

const SELECT_TRIGGER_BASE =
  "absolute inset-0 h-0 w-0 opacity-0 pointer-events-none sm:static sm:h-11 sm:opacity-100 sm:pointer-events-auto sm:flex bg-white border border-gray-200 rounded-lg px-4 text-sm font-medium text-gray-700 justify-between shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 data-[state=open]:border-primary-300";

const SELECT_CONTENT =
  "min-w-[164px] rounded-2xl border border-gray-200 bg-white py-1 shadow-[0px_16px_40px_rgba(15,23,42,0.15)]";

const SELECT_ITEM =
  "px-4 py-2 text-sm text-gray-600 border-b border-gray-200 last:border-b-0 data-[state=checked]:font-semibold data-[state=checked]:text-gray-900 data-[highlighted]:bg-gray-100";

const ICON_BUTTON =
  "sm:hidden size-11 rounded-lg bg-transparent p-0 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0";

interface FilterToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  /** Accessible name for the search box. The two lists search different things. */
  searchLabel: string;
  searchPlaceholder: string;
  sortValue: SortOption;
  onSortChange: (value: SortOption) => void;
  /**
   * Omit to render no category control. Recurring bills has none -- a bill's
   * category is not something you filter that list by.
   */
  category?: {
    value: CategoryFilter;
    onChange: (value: CategoryFilter) => void;
  };
}

/**
 * The search / sort / category bar above a list.
 *
 * Shared by the transactions and recurring bills pages, which carried
 * near-identical copies of it. The open/closed state of each dropdown is held
 * here rather than by the pages: it is presentational, and both pages were
 * duplicating it for no reason.
 *
 * **Each control group owns one thing** -- its mobile icon button, its desktop
 * label, and its Select. That grouping is load-bearing, not cosmetic. On mobile
 * the SelectTrigger is absolutely positioned to fill its own relative wrapper,
 * and Radix anchors the dropdown to that trigger, so a button placed in the
 * other group opens a menu that appears under the wrong icon. That was a real
 * defect on the transactions page (#56), fixed just before this extraction
 * precisely so it would not be baked in here.
 */
export function FilterToolbar({
  searchValue,
  onSearchChange,
  searchLabel,
  searchPlaceholder,
  sortValue,
  onSortChange,
  category,
}: FilterToolbarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <div className="w-full flex flex-row items-stretch sm:items-center gap-4 justify-between">
      <div className="w-full sm:flex-1 lg:max-w-[320px]">
        <div className="relative">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-12 h-11"
            aria-label={searchLabel}
          />
          <Image
            src="/assets/images/icon-search.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none"
          />
        </div>
      </div>

      <div className="flex gap-3 sm:gap-6 flex-row flex-shrink-0 min-w-0">
        {/* Sort */}
        <div className="relative flex flex-row gap-2 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={ICON_BUTTON}
            aria-label="Open sort options"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen(true)}
          >
            <Image
              src="/assets/images/icon-sort-mobile.svg"
              alt=""
              width={16}
              height={15}
              className="shrink-0"
              aria-hidden="true"
            />
          </Button>

          <span className="hidden sm:inline text-xs font-medium text-gray-500">
            Sort by
          </span>
          <Select
            value={sortValue}
            onValueChange={(value) => {
              onSortChange(value as SortOption);
              setIsSortOpen(false);
            }}
            open={isSortOpen}
            onOpenChange={setIsSortOpen}
          >
            <SelectTrigger
              aria-label="Sort by"
              className={`${SELECT_TRIGGER_BASE} sm:w-[115px] md:w-[130px] lg:w-[150px]`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className={SELECT_CONTENT}>
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  showIndicator={false}
                  className={SELECT_ITEM}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        {category ? (
          <div className="relative flex flex-row gap-2 items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={ICON_BUTTON}
              aria-label="Open category filter"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen(true)}
            >
              <Image
                src="/assets/images/icon-filter-mobile.svg"
                alt=""
                width={18}
                height={16}
                className="shrink-0"
                aria-hidden="true"
              />
            </Button>
            <span className="hidden sm:inline text-xs font-medium text-gray-500">
              Category
            </span>
            <Select
              value={category.value}
              onValueChange={(value) => {
                category.onChange(value as CategoryFilter);
                setIsCategoryOpen(false);
              }}
              open={isCategoryOpen}
              onOpenChange={setIsCategoryOpen}
            >
              <SelectTrigger
                aria-label="Category"
                className={`${SELECT_TRIGGER_BASE} sm:w-[140px] md:w-[160px] lg:w-[180px]`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={SELECT_CONTENT}>
                {CATEGORY_FILTER_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    showIndicator={false}
                    className={SELECT_ITEM}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
    </div>
  );
}
