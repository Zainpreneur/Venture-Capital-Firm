import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackLink, Badge, SectionCard } from "@/components/ui";
import { NotesPanel } from "@/components/notes-panel";
import { TasksPanel } from "@/components/tasks-panel";
import { ContactsPanel } from "@/components/contacts-panel";
import { DocumentsPanel } from "@/components/documents-panel";
import { ConvertDealForm } from "@/components/convert-deal-form";
import { deleteDeal } from "@/actions/deals";
import { formatUsd, formatDate } from "@/lib/format";
import {
  companyStageLabels,
  dealSourceLabels,
  dealStageBadge,
  dealStageLabels,
} from "@/lib/labels";

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const [deal, users, funds] = await Promise.all([
    prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        leadPartner: true,
        notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
        tasks: { include: { assignee: true }, orderBy: { createdAt: "desc" } },
        contacts: true,
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.fund.findMany({ where: { status: { in: ["INVESTING", "FUNDRAISING"] } }, orderBy: { vintageYear: "desc" } }),
  ]);

  if (!deal) notFound();

  const isClosed = deal.dealStage.startsWith("CLOSED");

  return (
    <div>
      <BackLink href="/deals" label="Back to pipeline" />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{deal.companyName}</h1>
            <Badge className={dealStageBadge[deal.dealStage]}>{dealStageLabels[deal.dealStage]}</Badge>
          </div>
          {deal.tagline && <p className="mt-1 text-sm text-ink-500">{deal.tagline}</p>}
          {deal.website && (
            <a href={deal.website} target="_blank" className="mt-1 inline-block text-sm text-gold-600 hover:underline">
              {deal.website}
            </a>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href={`/deals/${deal.id}/edit`} className="btn-outline">
            Edit
          </Link>
          <form action={deleteDeal.bind(null, deal.id)}>
            <button className="btn-ghost text-rose-500 hover:bg-rose-50">Delete</button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="Sector" value={deal.sector} />
        <MiniStat label="Stage" value={companyStageLabels[deal.stage]} />
        <MiniStat label="Size Sought" value={formatUsd(deal.dealSizeSoughtUsd, { compact: true })} />
        <MiniStat label="Valuation" value={formatUsd(deal.valuationExpectUsd, { compact: true })} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NotesPanel notes={deal.notes} dealId={deal.id} />
          <TasksPanel tasks={deal.tasks} users={users} dealId={deal.id} />
          <DocumentsPanel documents={deal.documents} dealId={deal.id} />
        </div>

        <div className="space-y-6">
          <SectionCard title="Deal Details">
            <dl className="space-y-3 text-sm">
              <Row label="Source" value={dealSourceLabels[deal.source]} />
              <Row label="Deal lead" value={deal.leadPartner?.name ?? "Unassigned"} />
              <Row label="Win probability" value={`${deal.probabilityPct}%`} />
              <Row label="Next step" value={deal.nextStep ?? "—"} />
              <Row label="Next step date" value={formatDate(deal.nextStepDate)} />
              <Row label="Created" value={formatDate(deal.createdAt)} />
              {deal.lostReason && <Row label="Lost reason" value={deal.lostReason} />}
            </dl>
          </SectionCard>

          {!isClosed && funds.length > 0 && (
            <SectionCard title="Close &amp; Fund">
              <ConvertDealForm
                dealId={deal.id}
                funds={funds}
                defaultAmount={deal.dealSizeSoughtUsd}
                defaultValuation={deal.valuationExpectUsd}
              />
            </SectionCard>
          )}

          <ContactsPanel contacts={deal.contacts} dealId={deal.id} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-ink-800">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-50 pb-2 last:border-0 last:pb-0">
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-right font-medium text-ink-700">{value}</dd>
    </div>
  );
}
