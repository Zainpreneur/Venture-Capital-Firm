import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState } from "@/components/ui";
import { KanbanBoard } from "@/components/kanban-board";
import { dealSourceLabels, dealStageBadge, dealStageLabels, companyStageLabels } from "@/lib/labels";
import { formatUsd, formatDate } from "@/lib/format";

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view = searchParams.view === "table" ? "table" : "board";

  const deals = await prisma.deal.findMany({
    include: { leadPartner: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Deal Pipeline"
        description="Track every opportunity from first contact through close."
        actions={
          <>
            <div className="flex rounded-lg border border-ink-200 bg-white p-0.5 text-sm">
              <Link
                href="/deals?view=board"
                className={`rounded-md px-3 py-1.5 font-medium ${view === "board" ? "bg-ink-900 text-white" : "text-ink-500"}`}
              >
                Board
              </Link>
              <Link
                href="/deals?view=table"
                className={`rounded-md px-3 py-1.5 font-medium ${view === "table" ? "bg-ink-900 text-white" : "text-ink-500"}`}
              >
                Table
              </Link>
            </div>
            <Link href="/deals/new" className="btn-gold">
              + New Deal
            </Link>
          </>
        }
      />

      {deals.length === 0 ? (
        <EmptyState
          title="No deals in the pipeline"
          description="Add your first opportunity to start tracking it through diligence and close."
          action={
            <Link href="/deals/new" className="btn-gold">
              + New Deal
            </Link>
          }
        />
      ) : view === "board" ? (
        <KanbanBoard
          deals={deals.map((d) => ({
            id: d.id,
            companyName: d.companyName,
            sector: d.sector,
            dealSizeSoughtUsd: d.dealSizeSoughtUsd,
            probabilityPct: d.probabilityPct,
            dealStage: d.dealStage,
            leadPartner: d.leadPartner,
          }))}
        />
      ) : (
        <div className="table-shell overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Stage</th>
                <th>Round</th>
                <th>Size Sought</th>
                <th>Source</th>
                <th>Lead</th>
                <th>Next Step</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td>
                    <Link href={`/deals/${deal.id}`} className="font-medium text-ink-900 hover:text-gold-600">
                      {deal.companyName}
                    </Link>
                  </td>
                  <td>{deal.sector}</td>
                  <td>
                    <Badge className={dealStageBadge[deal.dealStage]}>{dealStageLabels[deal.dealStage]}</Badge>
                  </td>
                  <td>{companyStageLabels[deal.stage]}</td>
                  <td>{formatUsd(deal.dealSizeSoughtUsd, { compact: true })}</td>
                  <td>{dealSourceLabels[deal.source]}</td>
                  <td>{deal.leadPartner?.name ?? "—"}</td>
                  <td className="max-w-[200px] truncate">
                    {deal.nextStep ?? "—"}
                    {deal.nextStepDate ? ` (${formatDate(deal.nextStepDate)})` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
