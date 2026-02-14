import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <Image
          src={icon}
          alt=""
          width={64}
          height={64}
          className="mx-auto mb-4 opacity-20"
          aria-hidden="true"
        />
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Button onClick={onAction}>{actionLabel}</Button>
      </div>
    </Card>
  );
}
