import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackLink, Badge, SectionCard, StatCard } from "@/components/ui";
import { NotesPanel } from "@/components/notes-panel";
import { TasksPanel } from "@/components/tasks-panel";
import { ContactsPanel } from "@/components/contacts-panel";
import { DocumentsPanel } from "@/components/documents-panel";
import { AddInvestmentForm } from "@/components/add-investment-form";
import { AddMetricForm } from "@/components/add-metric-form";
import { MetricHistoryChart } from "@/components/charts/metric-history-chart";
import { formatUsd, formatPct, formatDate } from "@/lib/format";
import {
  companyStageLabels,
  companyStatusBadge,
  companyStatusLabels,
  securityTypeLabels,
} from "@/lib/labels";

export default async function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const [company, funds, users] = await Promise.all([
    prisma.portfolioCompany.findUnique({
      where: { id: params.id },
      include: {
        investments: { include: { fund: true, leadPartner: true }, orderBy: { investmentDate: "asc" } },
        metrics: { orderBy: { periodDate: "asc" } },
        notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
        tasks: { include: { assignee: true }, orderBy: { createdAt: "desc" } },
        contacts: true,
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.fund.findMany({ orderBy: { vintageYear: "desc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!company) notFound();

  const invested = company.investments.reduce((s, i) => s + i.amountInvestedUsd, 0);
  const currentValue = company.investments.reduce((s, i) => s + (i.currentValueUsd ?? i.amountInvestedUsd), 0);
  const moic = invested > 0 ? currentValue / invested : 0;
  const totalOwnership = company.investments.reduce((s, i) => s + (i.ownershipPct ?? 0), 0);

  const metricData = company.metrics.map((m) => ({
    period: formatDate(m.periodDate),
    arr: m.arrUsd,
    revenue: m.revenueUsd,
  }));
  const latestMetric = company.metrics[company.metrics.length - 1];

  return (
    <div>
      <BackLink href="/portfolio" label="Back to portfolio" />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl2 bg-ink-900 font-display text-lg font-bold text-white">
            {company.logoLabel || company.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{company.name}</h1>
              <Badge className={companyStatusBadge[company.status]}>{companyStatusLabels[company.status]}</Badge>
            </div>
            {company.tagline && <p className="mt-1 text-sm text-ink-500">{company.tagline}</p>}
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-400">
              <span>{company.sector}</span>
              <span>· {companyStageLabels[company.stage]}</span>
              {company.hqCity && <span>· {company.hqCity}{company.hqCountry ? `, ${company.hqCountry}` : ""}</span>}
              {company.website && (
                <a href={company.website} target="_blank" className="text-gold-600 hover:underline">
                  · {company.website}
                </a>
              )}
            </div>
          </div>
        </div>
        <Link href={`/portfolio/${company.id}/edit`} className="btn-outline shrink-0">
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Invested" value={formatUsd(invested, { compact: true })} />
        <StatCard label="Current Value" value={formatUsd(currentValue, { compact: true })} tone="positive" />
        <StatCard label="MOIC" value={invested > 0 ? `${moic.toFixed(2)}x` : "—"} tone={moic >= 1 ? "positive" : "negative"} />
        <StatCard label="Fully Diluted Ownership" value={formatPct(totalOwnership)} tone="gold" />
      </div>

      {company.description && (
        <div className="card mt-6 p-5">
          <p className="text-sm leading-relaxed text-ink-600">{company.description}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Company Metrics">
            {company.metrics.length > 0 ? (
              <>
                <MetricHistoryChart data={metricData} />
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-50 pt-4 text-sm sm:grid-cols-4">
                  <MetricStat label="ARR" value={formatUsd(latestMetric?.arrUsd, { compact: true })} />
                  <MetricStat label="Gross Margin" value={formatPct(latestMetric?.grossMarginPct)} />
                  <MetricStat label="Monthly Burn" value={formatUsd(latestMetric?.burnRateUsd, { compact: true })} />
                  <MetricStat label="Runway" value={latestMetric?.runwayMonths ? `${latestMetric.runwayMonths}mo` : "—"} />
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-400">No metric snapshots recorded yet.</p>
            )}
            <details className="mt-4 border-t border-ink-50 pt-4">
              <summary className="cursor-pointer text-sm font-medium text-gold-600">+ Add metric snapshot</summary>
              <div className="mt-3">
                <AddMetricForm companyId={company.id} />
              </div>
            </details>
          </SectionCard>

          <SectionCard title="Investment Rounds">
            {company.investments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Fund</th>
                      <th>Date</th>
                      <th>Invested</th>
                      <th>Post-Money</th>
                      <th>Ownership</th>
                      <th>Type</th>
                      <th>Lead</th>
                    </tr>
                  </thead>
                  <tbody>
                    {company.investments.map((inv) => (
                      <tr key={inv.id}>
                        <td className="font-medium text-ink-800">{inv.roundName}</td>
                        <td>
                          <Link href={`/funds/${inv.fundId}`} className="text-gold-600 hover:underline">
                            {inv.fund.name}
                          </Link>
                        </td>
                        <td>{formatDate(inv.investmentDate)}</td>
                        <td>{formatUsd(inv.amountInvestedUsd, { compact: true })}</td>
                        <td>{formatUsd(inv.postMoneyUsd, { compact: true })}</td>
                        <td>{formatPct(inv.ownershipPct)}</td>
                        <td>{securityTypeLabels[inv.securityType]}</td>
                        <td>{inv.leadPartner?.name ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-ink-400">No investments logged yet.</p>
            )}
            <details className="mt-4 border-t border-ink-50 pt-4">
              <summary className="cursor-pointer text-sm font-medium text-gold-600">+ Log investment round</summary>
              <div className="mt-3">
                <AddInvestmentForm companyId={company.id} funds={funds} users={users} />
              </div>
            </details>
          </SectionCard>

          <NotesPanel notes={company.notes} portfolioCompanyId={company.id} />
          <TasksPanel tasks={company.tasks} users={users} portfolioCompanyId={company.id} />
        </div>

        <div className="space-y-6">
          <ContactsPanel contacts={company.contacts} portfolioCompanyId={company.id} />
          <DocumentsPanel documents={company.documents} portfolioCompanyId={company.id} />
        </div>
      </div>
    </div>
  );
}

function MetricStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="font-medium text-ink-800">{value}</p>
    </div>
  );
}
