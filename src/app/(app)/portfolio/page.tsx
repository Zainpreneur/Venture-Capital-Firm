import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState } from "@/components/ui";
import { formatUsd } from "@/lib/format";
import { companyStageLabels, companyStatusBadge, companyStatusLabels } from "@/lib/labels";

export default async function PortfolioPage() {
  const companies = await prisma.portfolioCompany.findMany({
    include: { investments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Portfolio Companies"
        description="Every company the firm has backed, with capital deployed and current marks."
        actions={
          <Link href="/portfolio/new" className="btn-gold">
            + Add Company
          </Link>
        }
      />

      {companies.length === 0 ? (
        <EmptyState
          title="No portfolio companies yet"
          description="Close a deal from the pipeline or add a company directly."
          action={
            <Link href="/portfolio/new" className="btn-gold">
              + Add Company
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => {
            const invested = c.investments.reduce((s, i) => s + i.amountInvestedUsd, 0);
            const currentValue = c.investments.reduce((s, i) => s + (i.currentValueUsd ?? i.amountInvestedUsd), 0);
            const moic = invested > 0 ? currentValue / invested : 0;
            return (
              <Link key={c.id} href={`/portfolio/${c.id}`} className="card flex flex-col p-5 transition-shadow hover:shadow-panel">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-ink-900 font-display text-sm font-bold text-white">
                      {c.logoLabel || c.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-ink-900">{c.name}</p>
                      <p className="text-xs text-ink-400">{c.sector}</p>
                    </div>
                  </div>
                  <Badge className={companyStatusBadge[c.status]}>{companyStatusLabels[c.status]}</Badge>
                </div>
                {c.tagline && <p className="mt-3 line-clamp-2 text-sm text-ink-500">{c.tagline}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-ink-50 pt-3 text-sm">
                  <div>
                    <p className="text-xs text-ink-400">Invested</p>
                    <p className="font-medium text-ink-800">{formatUsd(invested, { compact: true })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-400">MOIC</p>
                    <p className={`font-medium ${moic >= 1 ? "text-emerald-600" : "text-rose-500"}`}>
                      {invested > 0 ? `${moic.toFixed(2)}x` : "—"}
                    </p>
                  </div>
                  <Badge className="bg-ink-100 text-ink-500">{companyStageLabels[c.stage]}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
