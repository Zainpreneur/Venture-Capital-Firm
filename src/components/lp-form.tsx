import { lpTypeLabels } from "@/lib/labels";

type LpFormValues = {
  name?: string;
  type?: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  notes?: string | null;
};

export function LpFormFields({ values }: { values?: LpFormValues }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">LP name</label>
          <input name="name" required defaultValue={values?.name} className="input" />
        </div>
        <div>
          <label className="label">Type</label>
          <select name="type" defaultValue={values?.type ?? "INSTITUTIONAL"} className="input">
            {Object.entries(lpTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" defaultValue={values?.email ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input name="phone" defaultValue={values?.phone ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Country</label>
          <input name="country" defaultValue={values?.country ?? ""} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea name="notes" rows={3} defaultValue={values?.notes ?? ""} className="input resize-none" />
      </div>
    </div>
  );
}
