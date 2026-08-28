"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createContact(formData: FormData) {
  await requireUser();
  const dealId = parse.str(formData.get("dealId"));
  const portfolioCompanyId = parse.str(formData.get("portfolioCompanyId"));

  await prisma.contact.create({
    data: {
      name: parse.str(formData.get("name")) ?? "Unnamed Contact",
      title: parse.str(formData.get("title")),
      organization: parse.str(formData.get("organization")),
      email: parse.str(formData.get("email")),
      phone: parse.str(formData.get("phone")),
      type: (parse.str(formData.get("type")) as any) ?? "FOUNDER",
      linkedinUrl: parse.str(formData.get("linkedinUrl")),
      notesText: parse.str(formData.get("notesText")),
      dealId,
      portfolioCompanyId,
    },
  });

  revalidatePath("/contacts");
  if (dealId) revalidatePath(`/deals/${dealId}`);
  if (portfolioCompanyId) revalidatePath(`/portfolio/${portfolioCompanyId}`);
}

export async function deleteContact(contactId: string) {
  await requireUser();
  const contact = await prisma.contact.delete({ where: { id: contactId } });
  revalidatePath("/contacts");
  if (contact.dealId) revalidatePath(`/deals/${contact.dealId}`);
  if (contact.portfolioCompanyId) revalidatePath(`/portfolio/${contact.portfolioCompanyId}`);
}
