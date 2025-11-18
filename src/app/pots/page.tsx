"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import data from "@/../data.json";
import { Pot } from "@/lib/types";
import { THEME_COLORS, COLOR_THEMES } from "@/lib/constants";
import {
  AddPotModal,
  EditPotModal,
  DeletePotModal,
  AddToPotModal,
  WithdrawFromPotModal,
} from "@/components/modals";
import { PotCard } from "@/components/pots/PotCard";

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
