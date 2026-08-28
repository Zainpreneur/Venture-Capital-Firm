import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState } from "@/components/ui";
import { formatUsd } from "@/lib/format";
import { lpTypeLabels } from "@/lib/labels";

export default async function InvestorsPage() {
  const lps = await prisma.limitedPartner.findMany({
    include: { commitments: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        eyebrow="LP Relations"
        title="Limited Partners"
        description="Institutional and individual investors backing the firm's funds."
        actions={
          <Link href="/investors/new" className="btn-gold">
            + New LP
          </Link>
        }
      />

      {lps.length === 0 ? (
        <EmptyState
          title="No limited partners yet"
          description="Add an LP to start tracking fund commitments."
          action={
            <Link href="/investors/new" className="btn-gold">
              + New LP
            </Link>
          }
        />
      ) : (
        <div className="table-shell overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Country</th>
                <th>Total Committed</th>
                <th>Funds</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {lps.map((lp) => {
                const total = lp.commitments.reduce((s, c) => s + c.amountUsd, 0);
                return (
                  <tr key={lp.id}>
                    <td>
                      <Link href={`/investors/${lp.id}`} className="font-medium text-ink-900 hover:text-gold-600">
                        {lp.name}
                      </Link>
                    </td>
                    <td>
                      <Badge className="bg-ink-100 text-ink-600">{lpTypeLabels[lp.type]}</Badge>
                    </td>
                    <td>{lp.country ?? "—"}</td>
                    <td>{formatUsd(total, { compact: true })}</td>
                    <td>{lp.commitments.length}</td>
                    <td>{lp.email ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
