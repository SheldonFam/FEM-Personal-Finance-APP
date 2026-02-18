import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function PageLayout({ title, children, action }: PageLayoutProps) {
  return (
    <div className="bg-finance-beige p-4 md:p-8 pb-[68px] sm:pb-[90px] md:pb-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-balance">
            {title}
          </h1>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}
