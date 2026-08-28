import { convertDealToPortfolio } from "@/actions/deals";
import { securityTypeLabels } from "@/lib/labels";

export function ConvertDealForm({
  dealId,
  funds,
  defaultAmount,
  defaultValuation,
}: {
  dealId: string;
  funds: { id: string; name: string }[];
  defaultAmount?: number | null;
  defaultValuation?: number | null;
}) {
  return (
    <form action={convertDealToPortfolio.bind(null, dealId)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Investing fund</label>
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
          <input name="roundName" defaultValue="Seed" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Amount invested (USD)</label>
          <input name="amountInvestedUsd" type="number" defaultValue={defaultAmount ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Post-money valuation (USD)</label>
          <input name="postMoneyUsd" type="number" defaultValue={defaultValuation ?? ""} className="input" />
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
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink-600">
          <input type="checkbox" name="boardSeat" className="h-4 w-4 rounded border-ink-300" />
          Board seat obtained
        </label>
      </div>
      <button type="submit" className="btn-primary w-full">
        Close deal &amp; create portfolio company
      </button>
    </form>
  );
}
