import { addInvestment } from "@/actions/portfolio";
import { securityTypeLabels } from "@/lib/labels";

export function AddInvestmentForm({
  companyId,
  funds,
  users,
}: {
  companyId: string;
  funds: { id: string; name: string }[];
  users: { id: string; name: string }[];
}) {
  return (
    <form action={addInvestment.bind(null, companyId)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Fund</label>
          <select name="fundId" required className="input">
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Round name</label>
          <input name="roundName" required placeholder="Series A" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Investment date</label>
          <input name="investmentDate" type="date" className="input" />
        </div>
        <div>
          <label className="label">Amount invested (USD)</label>
          <input name="amountInvestedUsd" type="number" required className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Pre-money (USD)</label>
          <input name="preMoneyUsd" type="number" className="input" />
        </div>
        <div>
          <label className="label">Post-money (USD)</label>
          <input name="postMoneyUsd" type="number" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Ownership (%)</label>
          <input name="ownershipPct" type="number" step="0.1" className="input" />
        </div>
        <div>
          <label className="label">Current value (USD)</label>
          <input name="currentValueUsd" type="number" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Security type</label>
          <select name="securityType" defaultValue="PREFERRED_EQUITY" className="input">
            {Object.entries(securityTypeLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Lead partner</label>
          <select name="leadPartnerId" defaultValue="" className="input">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" name="boardSeat" className="h-4 w-4 rounded border-ink-300" />
        Board seat obtained
      </label>
      <button type="submit" className="btn-outline w-full">
        Log investment
      </button>
    </form>
  );
}
