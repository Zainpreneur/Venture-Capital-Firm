import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateFund } from "@/actions/funds";
import { BackLink, PageHeader } from "@/components/ui";
import { FundFormFields } from "@/components/fund-form";

export default async function EditFundPage({ params }: { params: { id: string } }) {
  const fund = await prisma.fund.findUnique({ where: { id: params.id } });
  if (!fund) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/funds/${fund.id}`} label="Back to fund" />
      <PageHeader eyebrow="Fund Operations" title={`Edit ${fund.name}`} />
      <form action={updateFund.bind(null, fund.id)} className="card space-y-6 p-6">
        <FundFormFields values={fund} />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
