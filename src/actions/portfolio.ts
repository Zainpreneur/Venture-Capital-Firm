"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createPortfolioCompany(formData: FormData) {
  await requireUser();
  const name = parse.str(formData.get("name")) ?? "Untitled Company";

  const company = await prisma.portfolioCompany.create({
    data: {
      name,
      tagline: parse.str(formData.get("tagline")),
      description: parse.str(formData.get("description")),
      website: parse.str(formData.get("website")),
      logoLabel: name.slice(0, 2).toUpperCase(),
      sector: parse.str(formData.get("sector")) ?? "Other",
      stage: (parse.str(formData.get("stage")) as any) ?? "SEED",
      status: (parse.str(formData.get("status")) as any) ?? "ACTIVE",
      foundedYear: parse.num(formData.get("foundedYear")),
      hqCity: parse.str(formData.get("hqCity")),
      hqCountry: parse.str(formData.get("hqCountry")),
      employeeCount: parse.num(formData.get("employeeCount")),
    },
  });

  revalidatePath("/portfolio");
  redirect(`/portfolio/${company.id}`);
}

export async function updatePortfolioCompany(companyId: string, formData: FormData) {
  await requireUser();
  await prisma.portfolioCompany.update({
    where: { id: companyId },
    data: {
      name: parse.str(formData.get("name")) ?? "Untitled Company",
      tagline: parse.str(formData.get("tagline")),
      description: parse.str(formData.get("description")),
      website: parse.str(formData.get("website")),
      sector: parse.str(formData.get("sector")) ?? "Other",
      stage: (parse.str(formData.get("stage")) as any) ?? "SEED",
      status: (parse.str(formData.get("status")) as any) ?? "ACTIVE",
      foundedYear: parse.num(formData.get("foundedYear")),
      hqCity: parse.str(formData.get("hqCity")),
      hqCountry: parse.str(formData.get("hqCountry")),
      employeeCount: parse.num(formData.get("employeeCount")),
    },
  });

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${companyId}`);
  redirect(`/portfolio/${companyId}`);
}

export async function addInvestment(companyId: string, formData: FormData) {
  await requireUser();
  const fundId = parse.str(formData.get("fundId"));
  if (!fundId) throw new Error("Fund is required.");

  await prisma.investment.create({
    data: {
      portfolioCompanyId: companyId,
      fundId,
      leadPartnerId: parse.str(formData.get("leadPartnerId")),
      roundName: parse.str(formData.get("roundName")) ?? "Round",
      investmentDate: parse.date(formData.get("investmentDate")) ?? new Date(),
      amountInvestedUsd: parse.num(formData.get("amountInvestedUsd")) ?? 0,
      preMoneyUsd: parse.num(formData.get("preMoneyUsd")),
      postMoneyUsd: parse.num(formData.get("postMoneyUsd")),
      ownershipPct: parse.num(formData.get("ownershipPct")),
      currentValueUsd:
        parse.num(formData.get("currentValueUsd")) ?? parse.num(formData.get("amountInvestedUsd")),
      securityType: (parse.str(formData.get("securityType")) as any) ?? "PREFERRED_EQUITY",
      boardSeat: formData.get("boardSeat") === "on",
    },
  });

  revalidatePath(`/portfolio/${companyId}`);
  revalidatePath("/funds");
}

export async function addMetricSnapshot(companyId: string, formData: FormData) {
  await requireUser();
  const periodDate = parse.date(formData.get("periodDate")) ?? new Date();

  await prisma.companyMetric.upsert({
    where: { portfolioCompanyId_periodDate: { portfolioCompanyId: companyId, periodDate } },
    create: {
      portfolioCompanyId: companyId,
      periodDate,
      arrUsd: parse.num(formData.get("arrUsd")),
      revenueUsd: parse.num(formData.get("revenueUsd")),
      grossMarginPct: parse.num(formData.get("grossMarginPct")),
      burnRateUsd: parse.num(formData.get("burnRateUsd")),
      cashBalanceUsd: parse.num(formData.get("cashBalanceUsd")),
      headcount: parse.num(formData.get("headcount")),
      runwayMonths: parse.num(formData.get("runwayMonths")),
    },
    update: {
      arrUsd: parse.num(formData.get("arrUsd")),
      revenueUsd: parse.num(formData.get("revenueUsd")),
      grossMarginPct: parse.num(formData.get("grossMarginPct")),
      burnRateUsd: parse.num(formData.get("burnRateUsd")),
      cashBalanceUsd: parse.num(formData.get("cashBalanceUsd")),
      headcount: parse.num(formData.get("headcount")),
      runwayMonths: parse.num(formData.get("runwayMonths")),
    },
  });

  revalidatePath(`/portfolio/${companyId}`);
}
