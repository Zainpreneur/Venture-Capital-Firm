import Link from "next/link";
import { createContact, deleteContact } from "@/actions/contacts";
import { contactTypeLabels } from "@/lib/labels";
import { initials } from "@/lib/format";

type ContactItem = {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  email: string | null;
  phone: string | null;
  type: string;
};

export function ContactsPanel({
  contacts,
  dealId,
  portfolioCompanyId,
}: {
  contacts: ContactItem[];
  dealId?: string;
  portfolioCompanyId?: string;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Contacts</h2>

      <form action={createContact} className="mb-5 space-y-2">
        {dealId && <input type="hidden" name="dealId" value={dealId} />}
        {portfolioCompanyId && (
          <input type="hidden" name="portfolioCompanyId" value={portfolioCompanyId} />
        )}
        <div className="grid grid-cols-2 gap-2">
          <input name="name" required placeholder="Name" className="input" />
          <input name="title" placeholder="Title" className="input" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input name="email" type="email" placeholder="Email" className="input" />
          <select name="type" className="input" defaultValue="FOUNDER">
            {Object.entries(contactTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-outline w-full">
          Add contact
        </button>
      </form>

      {contacts.length === 0 ? (
        <p className="text-sm text-ink-400">No contacts linked yet.</p>
      ) : (
        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-500">
                {initials(c.name)}
              </span>
              <div className="min-w-0 flex-1">
                <Link href="/contacts" className="truncate text-sm font-medium text-ink-800 hover:text-gold-600">
                  {c.name}
                </Link>
                <p className="truncate text-xs text-ink-400">
                  {[c.title, c.organization].filter(Boolean).join(" · ") || contactTypeLabels[c.type]}
                </p>
              </div>
              {c.email && (
                <a href={`mailto:${c.email}`} className="text-xs text-ink-400 hover:text-gold-600">
                  Email
                </a>
              )}
              <form action={deleteContact.bind(null, c.id)}>
                <button className="text-xs text-ink-300 hover:text-rose-500">✕</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
