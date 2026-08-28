import { addCapitalCall, addCommitment, addDistribution } from "@/actions/funds";
import { distributionTypeLabels } from "@/lib/labels";

export function AddCommitmentForm({ fundId, lps }: { fundId: string; lps: { id: string; name: string }[] }) {
  return (
    <form
      action={addCommitment.bind(null, fundId)}
      className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_9rem_9rem_auto]"
    >
      <select name="lpId" required className="input">
        <option value="">Select LP…</option>
        {lps.map((lp) => (
          <option key={lp.id} value={lp.id}>
            {lp.name}
          </option>
        ))}
      </select>
      <input name="amountUsd" type="number" required placeholder="Amount USD" className="input" />
      <input name="signedDate" type="date" className="input" />
      <button type="submit" className="btn-outline">
        Add
      </button>
    </form>
  );
}

export function AddCapitalCallForm({ fundId }: { fundId: string }) {
  return (
    <form
      action={addCapitalCall.bind(null, fundId)}
      className="grid grid-cols-1 gap-2 sm:grid-cols-[1.4fr_8rem_8rem_8rem_auto]"
    >
      <input name="purpose" required placeholder="Purpose" className="input" />
      <input name="amountUsd" type="number" required placeholder="Amount USD" className="input" />
      <input name="callDate" type="date" className="input" />
      <input name="dueDate" type="date" required className="input" />
      <button type="submit" className="btn-outline">
        Issue call
      </button>
    </form>
  );
}

export function AddDistributionForm({ fundId }: { fundId: string }) {
  return (
    <form
      action={addDistribution.bind(null, fundId)}
      className="grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr_9rem_auto]"
    >
      <select name="type" defaultValue="RETURN_OF_CAPITAL" className="input">
        {Object.entries(distributionTypeLabels).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <input name="amountUsd" type="number" required placeholder="Amount USD" className="input" />
      <input name="distributionDate" type="date" className="input" />
      <button type="submit" className="btn-outline">
        Record
      </button>
    </form>
  );
}
