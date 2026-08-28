import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard, SectionCard, Badge } from "@/components/ui";
import { DealsByStageChart } from "@/components/charts/deals-by-stage-chart";
import { SectorAllocationChart } from "@/components/charts/sector-allocation-chart";
import { formatUsd, formatDate, timeAgo, initials } from "@/lib/format";
import { dealStageLabels, dealStageOrder, dealStageBadge, taskPriorityBadge } from "@/lib/labels";

export default async function DashboardPage() {
  const [funds, deals, companies, investments, openTasks, recentNotes] = await Promise.all([
    prisma.fund.findMany({ include: { commitments: true, capitalCalls: true, distributions: true } }),
    prisma.deal.findMany({ include: { leadPartner: true } }),
    prisma.portfolioCompany.count({ where: { status: "ACTIVE" } }),
    prisma.investment.findMany({ include: { company: true } }),
    prisma.task.findMany({
      where: { status: { not: "DONE" } },
      include: { assignee: true, deal: true, company: true },
      orderBy: { dueDate: "asc" },
      take: 6,
    }),
    prisma.note.findMany({
      include: { author: true, deal: true, company: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const totalCommitted = funds.reduce(
    (sum, f) => sum + f.commitments.reduce((s, c) => s + c.amountUsd, 0),
    0
  );
  const totalCalled = funds.reduce(
    (sum, f) => sum + f.capitalCalls.reduce((s, c) => s + c.amountUsd, 0),
    0
  );
  const totalDistributed = funds.reduce(
    (sum, f) => sum + f.distributions.reduce((s, d) => s + d.amountUsd, 0),
    0
  );
  const totalInvested = investments.reduce((s, i) => s + i.amountInvestedUsd, 0);
  const totalCurrentValue = investments.reduce((s, i) => s + (i.currentValueUsd ?? i.amountInvestedUsd), 0);
  const moic = totalInvested > 0 ? totalCurrentValue / totalInvested : 0;

  const openDeals = deals.filter((d) => !d.dealStage.startsWith("CLOSED"));
  const dealsByStage = dealStageOrder
    .filter((s) => !s.startsWith("CLOSED"))
    .map((stage) => ({
      stage: dealStageLabels[stage],
      count: deals.filter((d) => d.dealStage === stage).length,
    }));

  const sectorMap = new Map<string, number>();
  for (const inv of investments) {
    sectorMap.set(inv.company.sector, (sectorMap.get(inv.company.sector) ?? 0) + inv.amountInvestedUsd);
  }
  const sectorData = Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Firm Dashboard"
        description="Deal flow, portfolio performance, and fund capital at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Capital Committed" value={formatUsd(totalCommitted, { compact: true })} hint={`Across ${funds.length} funds`} />
        <StatCard label="Capital Deployed" value={formatUsd(totalInvested, { compact: true })} hint={`${investments.length} investments`} tone="gold" />
        <StatCard label="Portfolio Value" value={formatUsd(totalCurrentValue, { compact: true })} hint={`${moic.toFixed(2)}x gross MOIC`} tone="positive" />
        <StatCard label="Active Deals" value={String(openDeals.length)} hint={`${companies} active portfolio companies`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionCard title="Pipeline by Stage" actions={<Link href="/deals" className="text-xs font-medium text-gold-600 hover:underline">View pipeline →</Link>}>
            <DealsByStageChart data={dealsByStage} />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Capital Deployed by Sector">
            {sectorData.length > 0 ? (
              <SectorAllocationChart data={sectorData} />
            ) : (
              <p className="py-16 text-center text-sm text-ink-400">No investments booked yet.</p>
            )}
          </SectionCard>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Recent Activity">
            {recentNotes.length === 0 ? (
              <p className="text-sm text-ink-400">No activity logged yet.</p>
            ) : (
              <ul className="space-y-4">
                {recentNotes.map((note) => (
                  <li key={note.id} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: note.author.colorTag }}
                    >
                      {initials(note.author.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-700">
                        <span className="font-medium text-ink-900">{note.author.name}</span>{" "}
                        logged a {note.type.toLowerCase()} on{" "}
                        {note.deal ? (
                          <Link href={`/deals/${note.deal.id}`} className="font-medium text-gold-600 hover:underline">
                            {note.deal.companyName}
                          </Link>
                        ) : note.company ? (
                          <Link href={`/portfolio/${note.company.id}`} className="font-medium text-gold-600 hover:underline">
                            {note.company.name}
                          </Link>
                        ) : (
                          "the firm"
                        )}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-ink-500">{note.content}</p>
                      <p className="mt-0.5 text-xs text-ink-300">{timeAgo(note.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Upcoming Tasks" actions={<Link href="/tasks" className="text-xs font-medium text-gold-600 hover:underline">View all →</Link>}>
          {openTasks.length === 0 ? (
            <p className="text-sm text-ink-400">Nothing on the board. Nice work.</p>
          ) : (
            <ul className="space-y-3">
              {openTasks.map((task) => (
                <li key={task.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">{task.title}</p>
                    <p className="text-xs text-ink-400">
                      {task.deal?.companyName ?? task.company?.name ?? "General"}
                      {task.dueDate ? ` · Due ${formatDate(task.dueDate)}` : ""}
                    </p>
                  </div>
                  <Badge className={taskPriorityBadge[task.priority]}>{task.priority}</Badge>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          title="Fund Capital Status"
          actions={<Link href="/funds" className="text-xs font-medium text-gold-600 hover:underline">Manage funds →</Link>}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Committed" value={formatUsd(totalCommitted, { compact: true })} />
            <StatCard label="Called" value={formatUsd(totalCalled, { compact: true })} />
            <StatCard label="Distributed" value={formatUsd(totalDistributed, { compact: true })} tone="positive" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
