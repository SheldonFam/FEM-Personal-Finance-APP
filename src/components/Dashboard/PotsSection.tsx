import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeader } from "./SectionHeader";
import { PotItem } from "./PotItem";
import type { Pot } from "@/lib/types";

interface PotsSectionProps {
  pots: Pot[];
  isLoading: boolean;
}

export function PotsSection({ pots, isLoading }: PotsSectionProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <SectionHeader title="Pots" href="/pots" linkText="See Details" />
        <div className="flex items-start gap-5 flex-col lg:flex-row">
          <Skeleton className="h-[100px] w-full lg:flex-1" />
          <div className="w-full lg:flex-1 grid grid-cols-2 gap-4">
            <Skeleton className="h-[50px]" />
            <Skeleton className="h-[50px]" />
            <Skeleton className="h-[50px]" />
            <Skeleton className="h-[50px]" />
          </div>
        </div>
      </Card>
    );
  }

  const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);
  const displayPots = pots.slice(0, 4);

  return (
    <Card className="p-8">
      <SectionHeader title="Pots" href="/pots" linkText="See Details" />

      <div className="flex items-start gap-5 flex-col lg:flex-row">
        {/* Total Saved */}
        <div className="bg-[#F8F4F0] rounded-xl p-5 flex items-center gap-4 w-full lg:flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Image
              src="/assets/images/icon-pot.svg"
              alt="Pot"
              width={20}
              height={20}
            />
          </div>
          <div>
            <p className="text-sm text-[#696868] mb-1">Total Saved</p>
            <p className="text-[32px] leading-[1.2] font-bold text-[#201F24]">
              ${totalSaved.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Individual Pots */}
        <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPots.map((pot, index) => (
            <PotItem
              key={index}
              label={pot.name}
              amount={pot.total}
              color={pot.theme}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
