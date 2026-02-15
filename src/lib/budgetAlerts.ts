export type AlertLevel = "safe" | "warning" | "exceeded";

export interface BudgetAlertStatus {
  level: AlertLevel;
  percentage: number;
  message: string;
}

export function getBudgetAlertStatus(
  spent: number,
  maximum: number,
): BudgetAlertStatus {
  if (maximum <= 0) {
    return { level: "safe", percentage: 0, message: "" };
  }

  const percentage = (spent / maximum) * 100;

  if (percentage >= 100) {
    return {
      level: "exceeded",
      percentage,
      message: `Budget exceeded by ${(percentage - 100).toFixed(0)}%`,
    };
  }

  if (percentage >= 80) {
    return {
      level: "warning",
      percentage,
      message: `${percentage.toFixed(0)}% of budget used`,
    };
  }

  return { level: "safe", percentage, message: "" };
}
