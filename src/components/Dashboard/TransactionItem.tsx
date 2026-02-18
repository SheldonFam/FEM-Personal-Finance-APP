import Image from "next/image";
import { normalizeImagePath } from "@/lib/utils";

interface TransactionItemProps {
  name: string;
  amount: number;
  date: string;
  avatar: string;
  isPositive?: boolean;
}

export function TransactionItem({
  name,
  amount,
  date,
  avatar,
  isPositive = false,
}: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={normalizeImagePath(avatar)}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-bold text-sm text-finance-navy">{name}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`font-bold text-sm tabular-nums ${
            isPositive ? "text-finance-green" : "text-finance-navy"
          }`}
        >
          {isPositive ? "+" : "-"}${Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-finance-grey mt-1">{date}</p>
      </div>
    </div>
  );
}
