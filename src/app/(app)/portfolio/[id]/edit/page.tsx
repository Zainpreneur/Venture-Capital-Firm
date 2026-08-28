import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePortfolioCompany } from "@/actions/portfolio";
import { BackLink, PageHeader } from "@/components/ui";
import { CompanyFormFields } from "@/components/company-form";

export default async function EditPortfolioCompanyPage({ params }: { params: { id: string } }) {
  const company = await prisma.portfolioCompany.findUnique({ where: { id: params.id } });
  if (!company) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={`/portfolio/${company.id}`} label="Back to company" />
      <PageHeader eyebrow="Portfolio" title={`Edit ${company.name}`} />
      <form action={updatePortfolioCompany.bind(null, company.id)} className="card space-y-6 p-6">
        <CompanyFormFields values={company} />
        <div className="flex justify-end gap-2 border-t border-ink-50 pt-4">
          <button type="submit" className="btn-gold">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
