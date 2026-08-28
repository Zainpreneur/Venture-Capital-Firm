"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createDeal(formData: FormData) {
  await requireUser();

  const deal = await prisma.deal.create({
    data: {
      companyName: parse.str(formData.get("companyName")) ?? "Untitled Deal",
      tagline: parse.str(formData.get("tagline")),
      website: parse.str(formData.get("website")),
      sector: parse.str(formData.get("sector")) ?? "Other",
      stage: (parse.str(formData.get("stage")) as any) ?? "SEED",
      dealStage: (parse.str(formData.get("dealStage")) as any) ?? "SOURCING",
      dealSizeSoughtUsd: parse.num(formData.get("dealSizeSoughtUsd")),
      valuationExpectUsd: parse.num(formData.get("valuationExpectUsd")),
      source: (parse.str(formData.get("source")) as any) ?? "REFERRAL",
      leadPartnerId: parse.str(formData.get("leadPartnerId")),
      probabilityPct: parse.num(formData.get("probabilityPct")) ?? 20,
      nextStep: parse.str(formData.get("nextStep")),
      nextStepDate: parse.date(formData.get("nextStepDate")),
    },
  });

  revalidatePath("/deals");
  redirect(`/deals/${deal.id}`);
}

export async function updateDealStage(dealId: string, dealStage: string) {
  await requireUser();
  await prisma.deal.update({
    where: { id: dealId },
    data: {
      dealStage: dealStage as any,
      ...(dealStage === "CLOSED_WON" || dealStage === "CLOSED_LOST"
        ? { probabilityPct: dealStage === "CLOSED_WON" ? 100 : 0 }
        : {}),
    },
  });
  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
}

export async function updateDeal(dealId: string, formData: FormData) {
  await requireUser();

  await prisma.deal.update({
    where: { id: dealId },
    data: {
      companyName: parse.str(formData.get("companyName")) ?? "Untitled Deal",
      tagline: parse.str(formData.get("tagline")),
      website: parse.str(formData.get("website")),
      sector: parse.str(formData.get("sector")) ?? "Other",
      stage: (parse.str(formData.get("stage")) as any) ?? "SEED",
      dealStage: (parse.str(formData.get("dealStage")) as any) ?? "SOURCING",
      dealSizeSoughtUsd: parse.num(formData.get("dealSizeSoughtUsd")),
      valuationExpectUsd: parse.num(formData.get("valuationExpectUsd")),
      source: (parse.str(formData.get("source")) as any) ?? "REFERRAL",
      leadPartnerId: parse.str(formData.get("leadPartnerId")),
      probabilityPct: parse.num(formData.get("probabilityPct")) ?? 20,
      nextStep: parse.str(formData.get("nextStep")),
      nextStepDate: parse.date(formData.get("nextStepDate")),
      lostReason: parse.str(formData.get("lostReason")),
    },
  });

  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
  redirect(`/deals/${dealId}`);
}

export async function deleteDeal(dealId: string) {
  await requireUser();
  await prisma.deal.delete({ where: { id: dealId } });
  revalidatePath("/deals");
  redirect("/deals");
}

export async function convertDealToPortfolio(dealId: string, formData: FormData) {
  const user = await requireUser();
  const deal = await prisma.deal.findUniqueOrThrow({ where: { id: dealId } });

  const fundId = parse.str(formData.get("fundId"));
  if (!fundId) throw new Error("Fund is required to close a deal into the portfolio.");

  const amountInvestedUsd = parse.num(formData.get("amountInvestedUsd")) ?? deal.dealSizeSoughtUsd ?? 0;
  const postMoneyUsd = parse.num(formData.get("postMoneyUsd")) ?? deal.valuationExpectUsd;
  const preMoneyUsd =
    postMoneyUsd && amountInvestedUsd ? postMoneyUsd - amountInvestedUsd : undefined;
  const ownershipPct =
    postMoneyUsd && amountInvestedUsd ? (amountInvestedUsd / postMoneyUsd) * 100 : undefined;

  const company = await prisma.portfolioCompany.create({
    data: {
      name: deal.companyName,
      tagline: deal.tagline,
      website: deal.website,
      sector: deal.sector,
      stage: deal.stage,
      status: "ACTIVE",
      logoLabel: deal.companyName.slice(0, 2).toUpperCase(),
      investments: {
        create: {
          fundId,
          leadPartnerId: deal.leadPartnerId ?? user.id,
          roundName: parse.str(formData.get("roundName")) ?? "Initial Round",
          amountInvestedUsd,
          preMoneyUsd,
          postMoneyUsd,
          ownershipPct,
          currentValueUsd: amountInvestedUsd,
          securityType: (parse.str(formData.get("securityType")) as any) ?? "PREFERRED_EQUITY",
          boardSeat: formData.get("boardSeat") === "on",
        },
      },
    },
  });

  await prisma.deal.update({
    where: { id: dealId },
    data: { dealStage: "CLOSED_WON", probabilityPct: 100 },
  });

  revalidatePath("/deals");
  revalidatePath("/portfolio");
  redirect(`/portfolio/${company.id}`);
}
