import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState, SectionCard } from "@/components/ui";
import { FundCapitalChart } from "@/components/charts/fund-capital-chart";
import { formatUsd, formatPct } from "@/lib/format";
import { fundStatusBadge, fundStatusLabels } from "@/lib/labels";

export default async function FundsPage() {
  const funds = await prisma.fund.findMany({
    include: { commitments: true, capitalCalls: true, distributions: true, investments: true },
    orderBy: { vintageYear: "desc" },
  });

  const chartData = funds.map((f) => ({
    name: f.name,
    committed: f.commitments.reduce((s, c) => s + c.amountUsd, 0),
    called: f.capitalCalls.reduce((s, c) => s + c.amountUsd, 0),
    distributed: f.distributions.reduce((s, d) => s + d.amountUsd, 0),
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Fund Operations"
        title="Funds"
        description="LP capital, calls, distributions, and deployment across every vehicle."
        actions={
          <Link href="/funds/new" className="btn-gold">
            + New Fund
          </Link>
        }
      />

      {funds.length === 0 ? (
        <EmptyState
          title="No funds yet"
          description="Create your first fund to start tracking commitments and capital activity."
          action={
            <Link href="/funds/new" className="btn-gold">
              + New Fund
            </Link>
          }
        />
      ) : (
        <>
          <SectionCard title="Capital Overview">
            <FundCapitalChart data={chartData} />
          </SectionCard>

          <div className="mt-6 table-shell overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Vintage</th>
                  <th>Status</th>
                  <th>Target Size</th>
                  <th>Committed</th>
                  <th>Called</th>
                  <th>Distributed</th>
                  <th>Deployed</th>
                  <th>DPI</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => {
                  const committed = f.commitments.reduce((s, c) => s + c.amountUsd, 0);
                  const called = f.capitalCalls.reduce((s, c) => s + c.amountUsd, 0);
                  const distributed = f.distributions.reduce((s, d) => s + d.amountUsd, 0);
                  const deployed = f.investments.reduce((s, i) => s + i.amountInvestedUsd, 0);
                  const dpi = called > 0 ? distributed / called : 0;
                  return (
                    <tr key={f.id}>
                      <td>
                        <Link href={`/funds/${f.id}`} className="font-medium text-ink-900 hover:text-gold-600">
                          {f.name}
                        </Link>
                      </td>
                      <td>{f.vintageYear}</td>
                      <td>
                        <Badge className={fundStatusBadge[f.status]}>{fundStatusLabels[f.status]}</Badge>
                      </td>
                      <td>{formatUsd(f.targetSizeUsd, { compact: true })}</td>
                      <td>{formatUsd(committed, { compact: true })}</td>
                      <td>{formatUsd(called, { compact: true })}</td>
                      <td>{formatUsd(distributed, { compact: true })}</td>
                      <td>{formatUsd(deployed, { compact: true })}</td>
                      <td>{formatPct(dpi * 100)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
