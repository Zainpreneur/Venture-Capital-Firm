import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState, SectionCard } from "@/components/ui";
import { createContact, deleteContact } from "@/actions/contacts";
import { contactTypeLabels } from "@/lib/labels";
import { initials } from "@/lib/format";

export default async function ContactsPage() {
  const [contacts, deals, companies] = await Promise.all([
    prisma.contact.findMany({
      include: { deal: true, company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deal.findMany({ orderBy: { companyName: "asc" }, select: { id: true, companyName: true } }),
    prisma.portfolioCompany.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Network"
        title="Contacts"
        description="Founders, advisors, co-investors, and service providers across the firm's network."
      />

      <div className="mb-6">
        <SectionCard title="Add a contact">
          <form action={createContact} className="grid grid-cols-1 gap-3 sm:grid-cols-6">
            <input name="name" required placeholder="Name" className="input sm:col-span-2" />
            <input name="title" placeholder="Title" className="input" />
            <input name="organization" placeholder="Organization" className="input" />
            <select name="type" defaultValue="FOUNDER" className="input">
              {Object.entries(contactTypeLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-gold">
              Add
            </button>
            <input name="email" type="email" placeholder="Email" className="input sm:col-span-2" />
            <input name="phone" placeholder="Phone" className="input" />
            <select name="dealId" defaultValue="" className="input sm:col-span-1">
              <option value="">Link to deal…</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.companyName}
                </option>
              ))}
            </select>
            <select name="portfolioCompanyId" defaultValue="" className="input sm:col-span-2">
              <option value="">Link to portfolio company…</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </form>
        </SectionCard>
      </div>

      {contacts.length === 0 ? (
        <EmptyState title="No contacts yet" description="Add founders, advisors, or co-investors to build the firm's network." />
      ) : (
        <div className="table-shell overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Organization</th>
                <th>Email</th>
                <th>Linked to</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[10px] font-semibold text-ink-500">
                      {initials(c.name)}
                    </span>
                    <div>
                      <p className="font-medium text-ink-900">{c.name}</p>
                      {c.title && <p className="text-xs text-ink-400">{c.title}</p>}
                    </div>
                  </td>
                  <td>
                    <Badge className="bg-ink-100 text-ink-600">{contactTypeLabels[c.type]}</Badge>
                  </td>
                  <td>{c.organization ?? "—"}</td>
                  <td>{c.email ? <a href={`mailto:${c.email}`} className="hover:text-gold-600">{c.email}</a> : "—"}</td>
                  <td>
                    {c.deal ? (
                      <Link href={`/deals/${c.deal.id}`} className="text-gold-600 hover:underline">
                        {c.deal.companyName}
                      </Link>
                    ) : c.company ? (
                      <Link href={`/portfolio/${c.company.id}`} className="text-gold-600 hover:underline">
                        {c.company.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <form action={deleteContact.bind(null, c.id)}>
                      <button className="text-xs text-ink-300 hover:text-rose-500">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
