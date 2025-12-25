"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import transactionsData from "@/data/data.json";
import { Pot } from "@/lib/types";
import {
  getThemeNameFromHex,
  getHexFromThemeName,
} from "@/lib/constants/constants";
import { PotFormModal } from "@/components/Modals/PotFormModal";
import { PotMoneyModal } from "@/components/Modals/PotMoneyModal";
import { DeleteConfirmationModal } from "@/components/Modals/DeleteConfirmationModal";
import { PotCard } from "@/components/Pots/PotCard";

export default function PotsPage() {
  const [pots, setPots] = useState<Pot[]>(transactionsData.pots as Pot[]);
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
      theme: getHexFromThemeName(data.theme) || data.theme,
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
              theme: getHexFromThemeName(data.theme) || data.theme,
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
    <div className="bg-gray-50 p-4 md:p-8 pb-24 md:pb-8">
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
      <PotFormModal
        mode="add"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddPot}
        existingPots={pots.map((p) => ({
          name: p.name,
          theme: getThemeNameFromHex(p.theme) || p.theme,
        }))}
      />

      {editingPot && (
        <PotFormModal
          mode="edit"
          open={!!editingPot}
          onOpenChange={(open) => !open && setEditingPot(null)}
          onSubmit={handleEditPot}
          initialData={{
            name: editingPot.name,
            target: editingPot.target,
            theme: getThemeNameFromHex(editingPot.theme) || editingPot.theme,
          }}
        />
      )}

      {deletingPot && (
        <DeleteConfirmationModal
          open={!!deletingPot}
          onOpenChange={(open) => !open && setDeletingPot(null)}
          onConfirm={handleDeletePot}
          title="Pot"
          itemName={deletingPot.name}
        />
      )}

      {addMoneyPot && (
        <PotMoneyModal
          mode="add"
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
        <PotMoneyModal
          mode="withdraw"
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
