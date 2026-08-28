import { createPortfolioCompany } from "@/actions/portfolio";
import { BackLink, PageHeader } from "@/components/ui";
import { CompanyFormFields } from "@/components/company-form";

export default function NewPortfolioCompanyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/portfolio" label="Back to portfolio" />
      <PageHeader eyebrow="Portfolio" title="Add Portfolio Company" />
      <form action={createPortfolioCompany} className="card space-y-6 p-6">
        <CompanyFormFields />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Create company
          </button>
        </div>
      </form>
    </div>
  );
}
