import { createLp } from "@/actions/investors";
import { BackLink, PageHeader } from "@/components/ui";
import { LpFormFields } from "@/components/lp-form";

export default function NewLpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/investors" label="Back to LPs" />
      <PageHeader eyebrow="LP Relations" title="New Limited Partner" />
      <form action={createLp} className="card space-y-6 p-6">
        <LpFormFields />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Create LP
          </button>
        </div>
      </form>
    </div>
  );
}
