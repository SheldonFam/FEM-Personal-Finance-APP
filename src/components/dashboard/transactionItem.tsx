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
        <p className="font-bold text-sm text-[#201F24]">{name}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`font-bold text-sm ${
            isPositive ? "text-[#277C78]" : "text-[#201F24]"
          }`}
        >
          {isPositive ? "+" : "-"}${Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-[#696868] mt-1">{date}</p>
      </div>
    </div>
  );
}
