"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Pot } from "@/lib/types";
import {
  getThemeNameFromHex,
  getHexFromThemeName,
} from "@/lib/constants/constants";
import PotFormModal from "@/components/Modals/PotFormModal";
import PotMoneyModal from "@/components/Modals/PotMoneyModal";
import { DeleteConfirmationModal } from "@/components/Modals/DeleteConfirmationModal";
import { PotCard } from "@/components/Pots/PotCard";
import {
  usePots,
  useCreatePot,
  useUpdatePot,
  useDeletePot,
  useAddMoneyToPot,
  useWithdrawFromPot,
} from "@/hooks/useFinanceData";
import { DataErrorAlert } from "@/components/DataErrorAlert";

export default function PotsPage() {
  const { data: pots = [], isLoading, isError } = usePots();

  const createPot = useCreatePot();
  const updatePot = useUpdatePot();
  const deletePot = useDeletePot();
  const addMoneyToPot = useAddMoneyToPot();
  const withdrawFromPot = useWithdrawFromPot();

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
    createPot.mutate(
      {
        name: data.name,
        target: data.target,
        total: 0,
        theme: getHexFromThemeName(data.theme) || data.theme,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
        },
      }
    );
  };

  const handleEditPot = (data: {
    name: string;
    target: number;
    theme: string;
  }) => {
    if (!editingPot || !editingPot.id) return;
    updatePot.mutate(
      {
        id: editingPot.id,
        name: data.name,
        target: data.target,
        theme: getHexFromThemeName(data.theme) || data.theme,
      },
      {
        onSuccess: () => {
          setEditingPot(null);
        },
      }
    );
  };

  const handleDeletePot = () => {
    if (!deletingPot || !deletingPot.id) return;
    deletePot.mutate(deletingPot.id, {
      onSuccess: () => {
        setDeletingPot(null);
      },
    });
  };

  const handleAddMoney = (amount: number) => {
    if (!addMoneyPot || !addMoneyPot.id) return;
    addMoneyToPot.mutate(
      { id: addMoneyPot.id, amount },
      {
        onSuccess: () => {
          setAddMoneyPot(null);
        },
      }
    );
  };

  const handleWithdraw = (amount: number) => {
    if (!withdrawPot || !withdrawPot.id) return;
    withdrawFromPot.mutate(
      { id: withdrawPot.id, amount },
      {
        onSuccess: () => {
          setWithdrawPot(null);
        },
      }
    );
  };

  return (
    <div className="bg-[#F8F4F0] p-4 md:p-8 pb-[68px] sm:pb-[90px] md:pb-8">
      <div className="max-w-[1440px] mx-auto">
        {isError && <DataErrorAlert />}

        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pots</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>+ Add New Pot</Button>
      </div>

      {/* Pots Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
          ))}
        </div>
      ) : pots.length > 0 ? (
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
    </div>
  );
}
