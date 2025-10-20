"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";

// Sidebar Navigation Component
const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "transactions", label: "Transactions", icon: "↕️" },
    { id: "budgets", label: "Budgets", icon: "📊" },
    { id: "pots", label: "Pots", icon: "💰" },
    { id: "bills", label: "Recurring Bills", icon: "📋" },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-white text-xl font-bold">finance</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-left transition-colors ${
              activeTab === item.id
                ? "bg-teal-100 text-gray-900"
                : "text-white hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Minimize Menu */}
      <div className="p-4">
        <button className="flex items-center space-x-2 text-white hover:text-gray-300">
          <span>←</span>
          <span className="text-sm">Minimize Menu</span>
        </button>
      </div>
    </div>
  );
};

// Summary Cards Component
const SummaryCards = () => {
  const cards = [
    {
      title: "Current Balance",
      amount: "$4,836.00",
      bgColor: "bg-gray-800",
      textColor: "text-white",
    },
    {
      title: "Income",
      amount: "$3,814.25",
      bgColor: "bg-gray-100",
      textColor: "text-gray-900",
    },
    {
      title: "Expenses",
      amount: "$1,700.50",
      bgColor: "bg-gray-100",
      textColor: "text-gray-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className={`p-6 ${card.bgColor}`}>
          <h3
            className={`text-sm font-medium mb-2 ${
              card.textColor === "text-white"
                ? "text-gray-300"
                : "text-gray-600"
            }`}
          >
            {card.title}
          </h3>
          <p className={`text-2xl font-bold ${card.textColor}`}>
            {card.amount}
          </p>
        </Card>
      ))}
    </div>
  );
};

// Pots Component
const PotsSection = () => {
  const pots = [
    { name: "Savings", amount: "$159" },
    { name: "Gift", amount: "$40" },
    { name: "Concert Ticket", amount: "$110" },
    { name: "New Laptop", amount: "$10" },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pots</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          See Details
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Total Saved */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">$</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-xl font-bold text-gray-900">$850</p>
          </div>
        </div>

        {/* Individual Pots */}
        <div className="flex-1 space-y-2">
          {pots.map((pot, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{pot.name}</span>
              <span className="font-semibold text-gray-900">{pot.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Transactions Component
const TransactionsSection = () => {
  const transactions = [
    {
      name: "Emma Richardson",
      amount: "+$75.50",
      date: "19 Aug 2024",
      type: "income",
    },
    {
      name: "Savory Bites Bistro",
      amount: "-$55.50",
      date: "19 Aug 2024",
      type: "expense",
      icon: "🍞",
    },
    {
      name: "Daniel Carter",
      amount: "-$42.30",
      date: "18 Aug 2024",
      type: "expense",
    },
    {
      name: "Sun Park",
      amount: "+$120.00",
      date: "17 Aug 2024",
      type: "income",
    },
    {
      name: "Urban Services Hub",
      amount: "-$65.00",
      date: "17 Aug 2024",
      type: "expense",
      icon: "⚙️",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex items-center space-x-4">
            {/* Avatar/Icon */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {transaction.icon ? (
                <span className="text-lg">{transaction.icon}</span>
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {transaction.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{transaction.name}</p>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>

            {/* Amount */}
            <p
              className={`font-semibold ${
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Budgets Component
const BudgetsSection = () => {
  const categories = [
    { name: "Entertainment", amount: "$50.00", color: "bg-teal-600" },
    { name: "Bills", amount: "$750.00", color: "bg-teal-300" },
    { name: "Dining Out", amount: "$75.00", color: "bg-orange-300" },
    { name: "Personal Care", amount: "$100.00", color: "bg-gray-600" },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budgets</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          See Details
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {/* Donut Chart */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
              strokeDasharray={`${(100 / 975) * 251.2} 251.2`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="8"
              strokeDasharray={`${(750 / 975) * 251.2} 251.2`}
              strokeDashoffset={`-${(100 / 975) * 251.2}`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="8"
              strokeDasharray={`${(50 / 975) * 251.2} 251.2`}
              strokeDashoffset={`-${(850 / 975) * 251.2}`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#fdba74"
              strokeWidth="8"
              strokeDasharray={`${(75 / 975) * 251.2} 251.2`}
              strokeDashoffset={`-${(900 / 975) * 251.2}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-gray-900">$338</p>
            <p className="text-xs text-gray-500">of $975 limit</p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="flex-1 space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <span className="text-gray-700 flex-1">{category.name}</span>
              <span className="font-semibold text-gray-900">
                {category.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Recurring Bills Component
const RecurringBillsSection = () => {
  const bills = [
    { label: "Paid Bills", amount: "$190.00", bgColor: "bg-green-100" },
    { label: "Total Upcoming", amount: "$194.98", bgColor: "bg-orange-100" },
    { label: "Due Soon", amount: "$59.98", bgColor: "bg-red-100" },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recurring Bills</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          See Details
        </button>
      </div>

      <div className="space-y-3">
        {bills.map((bill, index) => (
          <div
            key={index}
            className={`${bill.bgColor} rounded-lg p-3 flex justify-between items-center`}
          >
            <span className="font-medium text-gray-900">{bill.label}</span>
            <span className="font-semibold text-gray-900">{bill.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Overview</h1>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <PotsSection />
            <TransactionsSection />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <BudgetsSection />
            <RecurringBillsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

