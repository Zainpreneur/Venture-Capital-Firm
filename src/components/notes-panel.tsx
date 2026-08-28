import { createNote, deleteNote } from "@/actions/notes";
import { noteTypeLabels } from "@/lib/labels";
import { initials, timeAgo } from "@/lib/format";

type NoteItem = {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
  author: { name: string; colorTag: string };
};

export function NotesPanel({
  notes,
  dealId,
  portfolioCompanyId,
}: {
  notes: NoteItem[];
  dealId?: string;
  portfolioCompanyId?: string;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Activity &amp; Notes</h2>

      <form action={createNote} className="mb-5 space-y-2">
        {dealId && <input type="hidden" name="dealId" value={dealId} />}
        {portfolioCompanyId && (
          <input type="hidden" name="portfolioCompanyId" value={portfolioCompanyId} />
        )}
        <textarea
          name="content"
          required
          rows={2}
          placeholder="Log a call, meeting, or note…"
          className="input resize-none"
        />
        <div className="flex items-center justify-between">
          <select name="type" className="input w-40 py-1.5 text-xs" defaultValue="NOTE">
            {Object.entries(noteTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-outline py-1.5 text-xs">
            Add entry
          </button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-ink-400">No activity logged yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="flex gap-3">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: note.author.colorTag }}
              >
                {initials(note.author.name)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-800">{note.author.name}</span>
                  <span className="badge bg-ink-100 text-ink-500">
                    {noteTypeLabels[note.type]}
                  </span>
                  <span className="text-xs text-ink-300">{timeAgo(note.createdAt)}</span>
                  <form action={deleteNote.bind(null, note.id)} className="ml-auto">
                    <button className="text-xs text-ink-300 hover:text-rose-500">Delete</button>
                  </form>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink-600">{note.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
