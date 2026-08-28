import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateDeal } from "@/actions/deals";
import { BackLink, PageHeader } from "@/components/ui";
import { DealFormFields } from "@/components/deal-form";

export default async function EditDealPage({ params }: { params: { id: string } }) {
  const [deal, users] = await Promise.all([
    prisma.deal.findUnique({ where: { id: params.id } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!deal) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/deals/${deal.id}`} label="Back to deal" />
      <PageHeader eyebrow="Deal Pipeline" title={`Edit ${deal.companyName}`} />
      <form action={updateDeal.bind(null, deal.id)} className="card space-y-6 p-6">
        <DealFormFields values={deal} users={users} />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
