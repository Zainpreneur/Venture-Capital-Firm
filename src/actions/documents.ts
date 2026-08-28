"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createDocument(formData: FormData) {
  const user = await requireUser();
  const dealId = parse.str(formData.get("dealId"));
  const portfolioCompanyId = parse.str(formData.get("portfolioCompanyId"));
  const fundId = parse.str(formData.get("fundId"));
  const name = parse.str(formData.get("name"));
  if (!name) return;

  await prisma.document.create({
    data: {
      name,
      category: (parse.str(formData.get("category")) as any) ?? "OTHER",
      note: parse.str(formData.get("note")),
      sizeKb: parse.num(formData.get("sizeKb")) ?? 0,
      uploadedById: user.id,
      dealId,
      portfolioCompanyId,
      fundId,
    },
  });

  if (dealId) revalidatePath(`/deals/${dealId}`);
  if (portfolioCompanyId) revalidatePath(`/portfolio/${portfolioCompanyId}`);
  if (fundId) revalidatePath(`/funds/${fundId}`);
}

export async function deleteDocument(documentId: string) {
  await requireUser();
  const doc = await prisma.document.delete({ where: { id: documentId } });
  if (doc.dealId) revalidatePath(`/deals/${doc.dealId}`);
  if (doc.portfolioCompanyId) revalidatePath(`/portfolio/${doc.portfolioCompanyId}`);
  if (doc.fundId) revalidatePath(`/funds/${doc.fundId}`);
}
