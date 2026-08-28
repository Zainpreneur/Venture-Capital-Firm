import { fundStatusLabels } from "@/lib/labels";

type FundFormValues = {
  name?: string;
  vintageYear?: number;
  targetSizeUsd?: number;
  managementFeePct?: number;
  carryPct?: number;
  status?: string;
  closeDate?: Date | null;
  description?: string | null;
};

function toInputDate(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function FundFormFields({ values }: { values?: FundFormValues }) {
  return (
    <div className="space-y-5">
      <div>
        <label className="label">Fund name</label>
        <input name="name" required defaultValue={values?.name} className="input" placeholder="Meridian Peak Fund III" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Vintage year</label>
          <input
            name="vintageYear"
            type="number"
            required
            defaultValue={values?.vintageYear ?? new Date().getFullYear()}
            className="input"
          />
        </div>
        <div>
          <label className="label">Target size (USD)</label>
          <input name="targetSizeUsd" type="number" required defaultValue={values?.targetSizeUsd ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={values?.status ?? "FUNDRAISING"} className="input">
            {Object.entries(fundStatusLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Management fee (%)</label>
          <input name="managementFeePct" type="number" step="0.1" defaultValue={values?.managementFeePct ?? 2} className="input" />
        </div>
        <div>
          <label className="label">Carry (%)</label>
          <input name="carryPct" type="number" step="0.1" defaultValue={values?.carryPct ?? 20} className="input" />
        </div>
        <div>
          <label className="label">Close date</label>
          <input name="closeDate" type="date" defaultValue={toInputDate(values?.closeDate)} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={3} defaultValue={values?.description ?? ""} className="input resize-none" />
      </div>
    </div>
  );
}
