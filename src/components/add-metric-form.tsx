import { addMetricSnapshot } from "@/actions/portfolio";

export function AddMetricForm({ companyId }: { companyId: string }) {
  return (
    <form action={addMetricSnapshot.bind(null, companyId)} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div>
        <label className="label">Period</label>
        <input name="periodDate" type="date" required className="input" />
      </div>
      <div>
        <label className="label">ARR (USD)</label>
        <input name="arrUsd" type="number" className="input" />
      </div>
      <div>
        <label className="label">Revenue (USD)</label>
        <input name="revenueUsd" type="number" className="input" />
      </div>
      <div>
        <label className="label">Gross margin (%)</label>
        <input name="grossMarginPct" type="number" step="0.1" className="input" />
      </div>
      <div>
        <label className="label">Burn rate (USD/mo)</label>
        <input name="burnRateUsd" type="number" className="input" />
      </div>
      <div>
        <label className="label">Cash balance (USD)</label>
        <input name="cashBalanceUsd" type="number" className="input" />
      </div>
      <div>
        <label className="label">Headcount</label>
        <input name="headcount" type="number" className="input" />
      </div>
      <div>
        <label className="label">Runway (months)</label>
        <input name="runwayMonths" type="number" step="0.1" className="input" />
      </div>
      <div className="col-span-2 flex items-end sm:col-span-4">
        <button type="submit" className="btn-outline">
          Save snapshot
        </button>
      </div>
    </form>
  );
}
