import {
  companyStageLabels,
  dealSourceLabels,
  dealStageLabels,
} from "@/lib/labels";

type DealFormValues = {
  companyName?: string;
  tagline?: string | null;
  website?: string | null;
  sector?: string;
  stage?: string;
  dealStage?: string;
  dealSizeSoughtUsd?: number | null;
  valuationExpectUsd?: number | null;
  source?: string;
  leadPartnerId?: string | null;
  probabilityPct?: number;
  nextStep?: string | null;
  nextStepDate?: Date | null;
  lostReason?: string | null;
};

function toInputDate(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function DealFormFields({
  values,
  users,
}: {
  values?: DealFormValues;
  users: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Company name</label>
          <input name="companyName" required defaultValue={values?.companyName} className="input" />
        </div>
        <div>
          <label className="label">Website</label>
          <input name="website" defaultValue={values?.website ?? ""} className="input" placeholder="https://" />
        </div>
      </div>

      <div>
        <label className="label">Tagline</label>
        <input name="tagline" defaultValue={values?.tagline ?? ""} className="input" placeholder="One-line description" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Sector</label>
          <input name="sector" required defaultValue={values?.sector ?? ""} className="input" placeholder="Fintech" />
        </div>
        <div>
          <label className="label">Company Stage</label>
          <select name="stage" defaultValue={values?.stage ?? "SEED"} className="input">
            {Object.entries(companyStageLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Pipeline Stage</label>
          <select name="dealStage" defaultValue={values?.dealStage ?? "SOURCING"} className="input">
            {Object.entries(dealStageLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Deal size sought (USD)</label>
          <input
            name="dealSizeSoughtUsd"
            type="number"
            min={0}
            step={1000}
            defaultValue={values?.dealSizeSoughtUsd ?? ""}
            className="input"
          />
        </div>
        <div>
          <label className="label">Valuation expectation (USD)</label>
          <input
            name="valuationExpectUsd"
            type="number"
            min={0}
            step={1000}
            defaultValue={values?.valuationExpectUsd ?? ""}
            className="input"
          />
        </div>
        <div>
          <label className="label">Win probability (%)</label>
          <input
            name="probabilityPct"
            type="number"
            min={0}
            max={100}
            defaultValue={values?.probabilityPct ?? 20}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Source</label>
          <select name="source" defaultValue={values?.source ?? "REFERRAL"} className="input">
            {Object.entries(dealSourceLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Deal lead</label>
          <select name="leadPartnerId" defaultValue={values?.leadPartnerId ?? ""} className="input">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Next step</label>
          <input name="nextStep" defaultValue={values?.nextStep ?? ""} className="input" placeholder="Schedule partner meeting" />
        </div>
        <div>
          <label className="label">Next step date</label>
          <input name="nextStepDate" type="date" defaultValue={toInputDate(values?.nextStepDate)} className="input" />
        </div>
      </div>

      {values?.dealStage === "CLOSED_LOST" && (
        <div>
          <label className="label">Lost reason</label>
          <input name="lostReason" defaultValue={values?.lostReason ?? ""} className="input" />
        </div>
      )}
    </div>
  );
}
