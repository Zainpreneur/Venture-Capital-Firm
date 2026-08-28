import { prisma } from "@/lib/prisma";
import { createDeal } from "@/actions/deals";
import { BackLink, PageHeader } from "@/components/ui";
import { DealFormFields } from "@/components/deal-form";

export default async function NewDealPage() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/deals" label="Back to pipeline" />
      <PageHeader eyebrow="Deal Pipeline" title="New Deal" description="Add an opportunity to the pipeline." />
      <form action={createDeal} className="card space-y-6 p-6">
        <DealFormFields users={users} />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Create deal
          </button>
        </div>
      </form>
    </div>
  );
}
