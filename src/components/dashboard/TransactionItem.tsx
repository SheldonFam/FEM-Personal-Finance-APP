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
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={normalizeImagePath(avatar)}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-bold text-sm text-gray-900">{name}</p>
      </div>

      <div className="text-right">
        <p
          className={`font-bold text-sm ${
            isPositive ? "text-green-600" : "text-gray-900"
          }`}
        >
          {isPositive ? "+" : "-"}${Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  );
}
