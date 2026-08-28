import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackLink, Badge, SectionCard, StatCard } from "@/components/ui";
import { DocumentsPanel } from "@/components/documents-panel";
import { AddCapitalCallForm, AddCommitmentForm, AddDistributionForm } from "@/components/fund-capital-forms";
import { formatUsd, formatDate, formatPct } from "@/lib/format";
import {
  callStatusBadge,
  distributionTypeLabels,
  fundStatusBadge,
  fundStatusLabels,
} from "@/lib/labels";

export default async function FundDetailPage({ params }: { params: { id: string } }) {
  const [fund, lps] = await Promise.all([
    prisma.fund.findUnique({
      where: { id: params.id },
      include: {
        commitments: { include: { lp: true }, orderBy: { signedDate: "asc" } },
        capitalCalls: { orderBy: { callDate: "asc" } },
        distributions: { orderBy: { distributionDate: "asc" } },
        investments: { include: { company: true }, orderBy: { investmentDate: "asc" } },
        documents: { include: { uploadedBy: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.limitedPartner.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!fund) notFound();

  const committed = fund.commitments.reduce((s, c) => s + c.amountUsd, 0);
  const called = fund.capitalCalls.reduce((s, c) => s + c.amountUsd, 0);
  const distributed = fund.distributions.reduce((s, d) => s + d.amountUsd, 0);
  const deployed = fund.investments.reduce((s, i) => s + i.amountInvestedUsd, 0);
  const dpi = called > 0 ? distributed / called : 0;
  const dryPowder = committed - called;

  return (
    <div>
      <BackLink href="/funds" label="Back to funds" />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{fund.name}</h1>
            <Badge className={fundStatusBadge[fund.status]}>{fundStatusLabels[fund.status]}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Vintage {fund.vintageYear} · {formatPct(fund.managementFeePct)} management fee · {formatPct(fund.carryPct)} carry
          </p>
          {fund.description && <p className="mt-2 max-w-2xl text-sm text-ink-500">{fund.description}</p>}
        </div>
        <Link href={`/funds/${fund.id}/edit`} className="btn-outline shrink-0">
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Target Size" value={formatUsd(fund.targetSizeUsd, { compact: true })} />
        <StatCard label="Committed" value={formatUsd(committed, { compact: true })} />
        <StatCard label="Called" value={formatUsd(called, { compact: true })} />
        <StatCard label="Distributed" value={formatUsd(distributed, { compact: true })} tone="positive" />
        <StatCard label="Dry Powder" value={formatUsd(dryPowder, { compact: true })} tone="gold" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="LP Commitments">
            {fund.commitments.length > 0 ? (
              <ul className="mb-4 divide-y divide-ink-50">
                {fund.commitments.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                    <Link href={`/investors/${c.lpId}`} className="font-medium text-ink-800 hover:text-gold-600">
                      {c.lp.name}
                    </Link>
                    <span className="text-ink-500">{formatUsd(c.amountUsd, { compact: true })}</span>
                    <span className="text-xs text-ink-400">{formatDate(c.signedDate)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-ink-400">No LP commitments recorded yet.</p>
            )}
            <AddCommitmentForm fundId={fund.id} lps={lps} />
          </SectionCard>

          <SectionCard title="Capital Calls">
            {fund.capitalCalls.length > 0 ? (
              <ul className="mb-4 divide-y divide-ink-50">
                {fund.capitalCalls.map((call) => (
                  <li key={call.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-ink-800">
                        Call #{call.callNumber} · {call.purpose}
                      </p>
                      <p className="text-xs text-ink-400">Due {formatDate(call.dueDate)}</p>
                    </div>
                    <span className="shrink-0 text-ink-500">{formatUsd(call.amountUsd, { compact: true })}</span>
                    <Badge className={callStatusBadge[call.status]}>{call.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-ink-400">No capital calls issued yet.</p>
            )}
            <AddCapitalCallForm fundId={fund.id} />
          </SectionCard>

          <SectionCard title="Distributions">
            {fund.distributions.length > 0 ? (
              <ul className="mb-4 divide-y divide-ink-50">
                {fund.distributions.map((d) => (
                  <li key={d.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium text-ink-800">Distribution #{d.distributionNumber}</p>
                      <p className="text-xs text-ink-400">{distributionTypeLabels[d.type]}</p>
                    </div>
                    <span className="text-ink-500">{formatUsd(d.amountUsd, { compact: true })}</span>
                    <span className="text-xs text-ink-400">{formatDate(d.distributionDate)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-ink-400">No distributions recorded yet.</p>
            )}
            <AddDistributionForm fundId={fund.id} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Fund Metrics">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-ink-50 pb-2">
                <dt className="text-ink-400">Deployed</dt>
                <dd className="font-medium text-ink-700">{formatUsd(deployed, { compact: true })}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-ink-50 pb-2">
                <dt className="text-ink-400">DPI</dt>
                <dd className="font-medium text-ink-700">{formatPct(dpi * 100)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink-400">Portfolio companies</dt>
                <dd className="font-medium text-ink-700">{fund.investments.length}</dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title="Portfolio Companies">
            {fund.investments.length > 0 ? (
              <ul className="space-y-2">
                {fund.investments.map((inv) => (
                  <li key={inv.id}>
                    <Link
                      href={`/portfolio/${inv.portfolioCompanyId}`}
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-ink-50"
                    >
                      <span className="font-medium text-ink-800">{inv.company.name}</span>
                      <span className="text-ink-400">{formatUsd(inv.amountInvestedUsd, { compact: true })}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-400">No investments made from this fund yet.</p>
            )}
          </SectionCard>

          <DocumentsPanel documents={fund.documents} fundId={fund.id} />
        </div>
      </div>
    </div>
  );
}
