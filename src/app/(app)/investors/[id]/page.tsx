import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BackLink, Badge, SectionCard, StatCard } from "@/components/ui";
import { formatUsd, formatDate } from "@/lib/format";
import { lpTypeLabels } from "@/lib/labels";

export default async function LpDetailPage({ params }: { params: { id: string } }) {
  const lp = await prisma.limitedPartner.findUnique({
    where: { id: params.id },
    include: { commitments: { include: { fund: true }, orderBy: { signedDate: "asc" } } },
  });
  if (!lp) notFound();

  const total = lp.commitments.reduce((s, c) => s + c.amountUsd, 0);

  return (
    <div>
      <BackLink href="/investors" label="Back to LPs" />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{lp.name}</h1>
            <Badge className="bg-ink-100 text-ink-600">{lpTypeLabels[lp.type]}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-400">
            {lp.email && <a href={`mailto:${lp.email}`} className="hover:text-gold-600">{lp.email}</a>}
            {lp.phone && <span>{lp.phone}</span>}
            {lp.country && <span>{lp.country}</span>}
          </div>
        </div>
        <Link href={`/investors/${lp.id}/edit`} className="btn-outline shrink-0">
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Total Committed" value={formatUsd(total, { compact: true })} />
        <StatCard label="Fund Relationships" value={String(lp.commitments.length)} />
        <StatCard label="Avg. Commitment" value={formatUsd(lp.commitments.length ? total / lp.commitments.length : 0, { compact: true })} />
      </div>

      {lp.notes && (
        <div className="card mt-6 p-5">
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-800">Notes</h2>
          <p className="whitespace-pre-wrap text-sm text-ink-600">{lp.notes}</p>
        </div>
      )}

      <div className="mt-6">
        <SectionCard title="Commitments">
          {lp.commitments.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Amount</th>
                  <th>Signed</th>
                </tr>
              </thead>
              <tbody>
                {lp.commitments.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/funds/${c.fundId}`} className="font-medium text-ink-900 hover:text-gold-600">
                        {c.fund.name}
                      </Link>
                    </td>
                    <td>{formatUsd(c.amountUsd, { compact: true })}</td>
                    <td>{formatDate(c.signedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-ink-400">No fund commitments recorded yet.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
