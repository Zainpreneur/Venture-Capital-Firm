"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createNote(formData: FormData) {
  const user = await requireUser();
  const dealId = parse.str(formData.get("dealId"));
  const portfolioCompanyId = parse.str(formData.get("portfolioCompanyId"));
  const content = parse.str(formData.get("content"));
  if (!content) return;

  await prisma.note.create({
    data: {
      content,
      type: (parse.str(formData.get("type")) as any) ?? "NOTE",
      authorId: user.id,
      dealId,
      portfolioCompanyId,
    },
  });

  if (dealId) revalidatePath(`/deals/${dealId}`);
  if (portfolioCompanyId) revalidatePath(`/portfolio/${portfolioCompanyId}`);
}

export async function deleteNote(noteId: string) {
  await requireUser();
  const note = await prisma.note.delete({ where: { id: noteId } });
  if (note.dealId) revalidatePath(`/deals/${note.dealId}`);
  if (note.portfolioCompanyId) revalidatePath(`/portfolio/${note.portfolioCompanyId}`);
}
