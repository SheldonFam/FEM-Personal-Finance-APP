"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import data from "@/../data.json";
import {
  AddPotModal,
  EditPotModal,
  DeletePotModal,
  AddToPotModal,
  WithdrawFromPotModal,
} from "@/components/modals";

// Types
interface Pot {
  name: string;
  target: number;
  total: number;
  theme: string;
}

// Theme color mapping
const THEME_COLORS: Record<string, string> = {
  "#277C78": "Green",
  "#F2CDAC": "Yellow",
  "#82C9D7": "Cyan",
  "#626070": "Navy",
  "#C94736": "Red",
  "#826CB0": "Purple",
  "#597C7C": "Turquoise",
  "#93674F": "Brown",
  "#934F6F": "Magenta",
  "#3F82B2": "Blue",
  "#97A0AC": "Navy Grey",
  "#7F9161": "Army Green",
  "#AF81BA": "Pink",
  "#CAB361": "Gold",
  "#BE6C49": "Orange",
};

const COLOR_THEMES: Record<string, string> = {
  Green: "#277C78",
  Yellow: "#F2CDAC",
  Cyan: "#82C9D7",
  Navy: "#626070",
  Red: "#C94736",
  Purple: "#826CB0",
  Turquoise: "#597C7C",
  Brown: "#93674F",
  Magenta: "#934F6F",
  Blue: "#3F82B2",
  "Navy Grey": "#97A0AC",
  "Army Green": "#7F9161",
  Pink: "#AF81BA",
  Gold: "#CAB361",
  Orange: "#BE6C49",
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Individual Pot Card Component
const PotCard = ({
  pot,
  onEdit,
  onDelete,
  onAddMoney,
  onWithdraw,
}: {
  pot: Pot;
  onEdit: () => void;
  onDelete: () => void;
  onAddMoney: () => void;
  onWithdraw: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const percentage = Math.min((pot.total / pot.target) * 100, 100);

  return (
    <Card className="p-5 md:p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: pot.theme }}
          />
          <h3 className="text-xl font-bold text-gray-900">{pot.name}</h3>
        </div>
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Options"
          >
            <Image
              src="/assets/images/icon-ellipsis.svg"
              alt="Options"
              width={16}
              height={4}
            />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Pot
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete Pot
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Total Saved */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-3">Total Saved</p>
        <p className="text-[32px] font-bold text-gray-900">
          {formatCurrency(pot.total)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress
          value={percentage}
          className="h-2 rounded-full mb-3"
          color={pot.theme}
        />
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-900">
            {percentage.toFixed(1)}%
          </span>
          <span className="text-gray-500">
            Target of {formatCurrency(pot.target)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onAddMoney}
          className="h-[53px] text-sm font-bold"
        >
          + Add Money
        </Button>
        <Button
          variant="outline"
          onClick={onWithdraw}
          className="h-[53px] text-sm font-bold"
        >
          Withdraw
        </Button>
      </div>
    </Card>
  );
};

// Main Pots Page Component
export default function PotsPage() {
  const [pots, setPots] = useState<Pot[]>(data.pots as Pot[]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPot, setEditingPot] = useState<Pot | null>(null);
  const [deletingPot, setDeletingPot] = useState<Pot | null>(null);
  const [addMoneyPot, setAddMoneyPot] = useState<Pot | null>(null);
  const [withdrawPot, setWithdrawPot] = useState<Pot | null>(null);

  const handleAddPot = (data: {
    name: string;
    target: number;
    theme: string;
  }) => {
    const newPot: Pot = {
      name: data.name,
      target: data.target,
      total: 0,
      theme: COLOR_THEMES[data.theme] || data.theme,
    };
    setPots([...pots, newPot]);
  };

  const handleEditPot = (data: {
    name: string;
    target: number;
    theme: string;
  }) => {
    if (!editingPot) return;
    setPots(
      pots.map((p) =>
        p.name === editingPot.name
          ? {
              ...p,
              name: data.name,
              target: data.target,
              theme: COLOR_THEMES[data.theme] || data.theme,
            }
          : p
      )
    );
    setEditingPot(null);
  };

  const handleDeletePot = () => {
    if (!deletingPot) return;
    setPots(pots.filter((p) => p.name !== deletingPot.name));
    setDeletingPot(null);
  };

  const handleAddMoney = (amount: number) => {
    if (!addMoneyPot) return;
    setPots(
      pots.map((p) =>
        p.name === addMoneyPot.name ? { ...p, total: p.total + amount } : p
      )
    );
    setAddMoneyPot(null);
  };

  const handleWithdraw = (amount: number) => {
    if (!withdrawPot) return;
    setPots(
      pots.map((p) =>
        p.name === withdrawPot.name
          ? { ...p, total: Math.max(0, p.total - amount) }
          : p
      )
    );
    setWithdrawPot(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pots</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>+ Add New Pot</Button>
      </div>

      {/* Pots Grid */}
      {pots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pots.map((pot) => (
            <PotCard
              key={pot.name}
              pot={pot}
              onEdit={() =>
                setEditingPot({
                  ...pot,
                })
              }
              onDelete={() => setDeletingPot(pot)}
              onAddMoney={() => setAddMoneyPot(pot)}
              onWithdraw={() => setWithdrawPot(pot)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Image
              src="/assets/images/icon-pot.svg"
              alt="No pots"
              width={64}
              height={64}
              className="mx-auto mb-4 opacity-20"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No pots yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first pot to start saving towards your goals.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Add New Pot
            </Button>
          </div>
        </Card>
      )}

      {/* Modals */}
      <AddPotModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddPot}
        existingPots={pots.map((p) => ({
          name: p.name,
          theme: THEME_COLORS[p.theme] || p.theme,
        }))}
      />

      {editingPot && (
        <EditPotModal
          open={!!editingPot}
          onOpenChange={(open) => !open && setEditingPot(null)}
          onSubmit={handleEditPot}
          pot={{
            name: editingPot.name,
            target: editingPot.target,
            theme: THEME_COLORS[editingPot.theme] || editingPot.theme,
          }}
        />
      )}

      {deletingPot && (
        <DeletePotModal
          open={!!deletingPot}
          onOpenChange={(open) => !open && setDeletingPot(null)}
          onConfirm={handleDeletePot}
          potName={deletingPot.name}
        />
      )}

      {addMoneyPot && (
        <AddToPotModal
          open={!!addMoneyPot}
          onOpenChange={(open) => !open && setAddMoneyPot(null)}
          onSubmit={handleAddMoney}
          pot={{
            name: addMoneyPot.name,
            currentAmount: addMoneyPot.total,
            targetAmount: addMoneyPot.target,
            theme: addMoneyPot.theme,
          }}
        />
      )}

      {withdrawPot && (
        <WithdrawFromPotModal
          open={!!withdrawPot}
          onOpenChange={(open) => !open && setWithdrawPot(null)}
          onSubmit={handleWithdraw}
          pot={{
            name: withdrawPot.name,
            currentAmount: withdrawPot.total,
            targetAmount: withdrawPot.target,
            theme: withdrawPot.theme,
          }}
        />
      )}
    </div>
  );
}
