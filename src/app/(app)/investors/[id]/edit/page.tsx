import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateLp } from "@/actions/investors";
import { BackLink, PageHeader } from "@/components/ui";
import { LpFormFields } from "@/components/lp-form";

export default async function EditLpPage({ params }: { params: { id: string } }) {
  const lp = await prisma.limitedPartner.findUnique({ where: { id: params.id } });
  if (!lp) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/investors/${lp.id}`} label="Back to LP" />
      <PageHeader eyebrow="LP Relations" title={`Edit ${lp.name}`} />
      <form action={updateLp.bind(null, lp.id)} className="card space-y-6 p-6">
        <LpFormFields values={lp} />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
