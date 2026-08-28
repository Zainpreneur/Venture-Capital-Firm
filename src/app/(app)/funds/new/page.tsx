import { createFund } from "@/actions/funds";
import { BackLink, PageHeader } from "@/components/ui";
import { FundFormFields } from "@/components/fund-form";

export default function NewFundPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/funds" label="Back to funds" />
      <PageHeader eyebrow="Fund Operations" title="New Fund" />
      <form action={createFund} className="card space-y-6 p-6">
        <FundFormFields />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Create fund
          </button>
        </div>
      </form>
    </div>
  );
}
