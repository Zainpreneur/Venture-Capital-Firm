import { companyStageLabels, companyStatusLabels } from "@/lib/labels";

type CompanyFormValues = {
  name?: string;
  tagline?: string | null;
  description?: string | null;
  website?: string | null;
  sector?: string;
  stage?: string;
  status?: string;
  foundedYear?: number | null;
  hqCity?: string | null;
  hqCountry?: string | null;
  employeeCount?: number | null;
};

export function CompanyFormFields({ values }: { values?: CompanyFormValues }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Company name</label>
          <input name="name" required defaultValue={values?.name} className="input" />
        </div>
        <div>
          <label className="label">Website</label>
          <input name="website" defaultValue={values?.website ?? ""} className="input" placeholder="https://" />
        </div>
      </div>

      <div>
        <label className="label">Tagline</label>
        <input name="tagline" defaultValue={values?.tagline ?? ""} className="input" />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={3} defaultValue={values?.description ?? ""} className="input resize-none" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Sector</label>
          <input name="sector" required defaultValue={values?.sector ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Stage</label>
          <select name="stage" defaultValue={values?.stage ?? "SEED"} className="input">
            {Object.entries(companyStageLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={values?.status ?? "ACTIVE"} className="input">
            {Object.entries(companyStatusLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label className="label">Founded year</label>
          <input name="foundedYear" type="number" defaultValue={values?.foundedYear ?? ""} className="input" />
        </div>
        <div>
          <label className="label">HQ City</label>
          <input name="hqCity" defaultValue={values?.hqCity ?? ""} className="input" />
        </div>
        <div>
          <label className="label">HQ Country</label>
          <input name="hqCountry" defaultValue={values?.hqCountry ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Employees</label>
          <input name="employeeCount" type="number" defaultValue={values?.employeeCount ?? ""} className="input" />
        </div>
      </div>
    </div>
  );
}
