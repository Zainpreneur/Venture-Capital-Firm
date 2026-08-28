import { createDocument, deleteDocument } from "@/actions/documents";
import { documentCategoryLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

type DocItem = {
  id: string;
  name: string;
  category: string;
  sizeKb: number;
  createdAt: Date;
  uploadedBy: { name: string } | null;
};

export function DocumentsPanel({
  documents,
  dealId,
  portfolioCompanyId,
  fundId,
}: {
  documents: DocItem[];
  dealId?: string;
  portfolioCompanyId?: string;
  fundId?: string;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Documents</h2>

      <form action={createDocument} className="mb-5 space-y-2">
        {dealId && <input type="hidden" name="dealId" value={dealId} />}
        {portfolioCompanyId && (
          <input type="hidden" name="portfolioCompanyId" value={portfolioCompanyId} />
        )}
        {fundId && <input type="hidden" name="fundId" value={fundId} />}
        <input name="name" required placeholder="Document name…" className="input" />
        <div className="flex gap-2">
          <select name="category" className="input flex-1" defaultValue="OTHER">
            {Object.entries(documentCategoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-outline shrink-0">
            Attach
          </button>
        </div>
      </form>

      {documents.length === 0 ? (
        <p className="text-sm text-ink-400">No documents attached.</p>
      ) : (
        <ul className="divide-y divide-ink-50">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
                  <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                  <path d="M15 3v5h5" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-800">{doc.name}</p>
                <p className="text-xs text-ink-400">
                  {documentCategoryLabels[doc.category]} · {formatDate(doc.createdAt)}
                  {doc.uploadedBy && ` · ${doc.uploadedBy.name}`}
                </p>
              </div>
              <form action={deleteDocument.bind(null, doc.id)}>
                <button className="text-xs text-ink-300 hover:text-rose-500">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
