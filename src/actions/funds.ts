"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createFund(formData: FormData) {
  await requireUser();

  const fund = await prisma.fund.create({
    data: {
      name: parse.str(formData.get("name")) ?? "Untitled Fund",
      vintageYear: parse.num(formData.get("vintageYear")) ?? new Date().getFullYear(),
      targetSizeUsd: parse.num(formData.get("targetSizeUsd")) ?? 0,
      managementFeePct: parse.num(formData.get("managementFeePct")) ?? 2,
      carryPct: parse.num(formData.get("carryPct")) ?? 20,
      status: (parse.str(formData.get("status")) as any) ?? "FUNDRAISING",
      closeDate: parse.date(formData.get("closeDate")),
      description: parse.str(formData.get("description")),
    },
  });

  revalidatePath("/funds");
  redirect(`/funds/${fund.id}`);
}

export async function updateFund(fundId: string, formData: FormData) {
  await requireUser();
  await prisma.fund.update({
    where: { id: fundId },
    data: {
      name: parse.str(formData.get("name")) ?? "Untitled Fund",
      vintageYear: parse.num(formData.get("vintageYear")) ?? new Date().getFullYear(),
      targetSizeUsd: parse.num(formData.get("targetSizeUsd")) ?? 0,
      managementFeePct: parse.num(formData.get("managementFeePct")) ?? 2,
      carryPct: parse.num(formData.get("carryPct")) ?? 20,
      status: (parse.str(formData.get("status")) as any) ?? "FUNDRAISING",
      closeDate: parse.date(formData.get("closeDate")),
      description: parse.str(formData.get("description")),
    },
  });
  revalidatePath("/funds");
  revalidatePath(`/funds/${fundId}`);
  redirect(`/funds/${fundId}`);
}

export async function addCommitment(fundId: string, formData: FormData) {
  await requireUser();
  const lpId = parse.str(formData.get("lpId"));
  if (!lpId) throw new Error("LP is required.");

  await prisma.commitment.create({
    data: {
      fundId,
      lpId,
      amountUsd: parse.num(formData.get("amountUsd")) ?? 0,
      signedDate: parse.date(formData.get("signedDate")) ?? new Date(),
    },
  });

  revalidatePath(`/funds/${fundId}`);
  revalidatePath("/investors");
}

export async function addCapitalCall(fundId: string, formData: FormData) {
  await requireUser();
  const existingCalls = await prisma.capitalCall.count({ where: { fundId } });

  await prisma.capitalCall.create({
    data: {
      fundId,
      callNumber: existingCalls + 1,
      purpose: parse.str(formData.get("purpose")) ?? "Capital call",
      amountUsd: parse.num(formData.get("amountUsd")) ?? 0,
      callDate: parse.date(formData.get("callDate")) ?? new Date(),
      dueDate: parse.date(formData.get("dueDate")) ?? new Date(),
      status: (parse.str(formData.get("status")) as any) ?? "PENDING",
    },
  });

  revalidatePath(`/funds/${fundId}`);
}

export async function addDistribution(fundId: string, formData: FormData) {
  await requireUser();
  const existing = await prisma.distribution.count({ where: { fundId } });

  await prisma.distribution.create({
    data: {
      fundId,
      distributionNumber: existing + 1,
      amountUsd: parse.num(formData.get("amountUsd")) ?? 0,
      distributionDate: parse.date(formData.get("distributionDate")) ?? new Date(),
      type: (parse.str(formData.get("type")) as any) ?? "RETURN_OF_CAPITAL",
    },
  });

  revalidatePath(`/funds/${fundId}`);
}
