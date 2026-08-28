"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateDealStage } from "@/actions/deals";
import { dealStageLabels, dealStageOrder } from "@/lib/labels";
import { formatUsd } from "@/lib/format";

type DealCard = {
  id: string;
  companyName: string;
  sector: string;
  dealSizeSoughtUsd: number | null;
  probabilityPct: number;
  dealStage: string;
  leadPartner: { name: string; colorTag: string } | null;
};

const BOARD_STAGES = dealStageOrder.filter((s) => !s.startsWith("CLOSED")).concat(["CLOSED_WON", "CLOSED_LOST"]);

export function KanbanBoard({ deals }: { deals: DealCard[] }) {
  const [items, setItems] = useState(deals);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleDrop(stage: string) {
    if (!dragId) return;
    setItems((prev) => prev.map((d) => (d.id === dragId ? { ...d, dealStage: stage } : d)));
    startTransition(() => {
      updateDealStage(dragId, stage);
    });
    setDragId(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {BOARD_STAGES.map((stage) => {
        const stageDeals = items.filter((d) => d.dealStage === stage);
        return (
          <div
            key={stage}
            className="kanban-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage)}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-ink-700">{dealStageLabels[stage]}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink-400">
                {stageDeals.length}
              </span>
            </div>
            <div className="min-h-[80px] flex-1">
              {stageDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  draggable
                  onDragStart={() => setDragId(deal.id)}
                  className="kanban-card block"
                >
                  <p className="text-sm font-medium text-ink-900">{deal.companyName}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{deal.sector}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-600">
                      {formatUsd(deal.dealSizeSoughtUsd, { compact: true })}
                    </span>
                    {deal.leadPartner && (
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                        style={{ backgroundColor: deal.leadPartner.colorTag }}
                        title={deal.leadPartner.name}
                      >
                        {deal.leadPartner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-gold-400"
                      style={{ width: `${deal.probabilityPct}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
