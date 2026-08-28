"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createLp(formData: FormData) {
  await requireUser();

  const lp = await prisma.limitedPartner.create({
    data: {
      name: parse.str(formData.get("name")) ?? "Untitled LP",
      type: (parse.str(formData.get("type")) as any) ?? "INSTITUTIONAL",
      email: parse.str(formData.get("email")),
      phone: parse.str(formData.get("phone")),
      country: parse.str(formData.get("country")),
      notes: parse.str(formData.get("notes")),
    },
  });

  revalidatePath("/investors");
  redirect(`/investors/${lp.id}`);
}

export async function updateLp(lpId: string, formData: FormData) {
  await requireUser();
  await prisma.limitedPartner.update({
    where: { id: lpId },
    data: {
      name: parse.str(formData.get("name")) ?? "Untitled LP",
      type: (parse.str(formData.get("type")) as any) ?? "INSTITUTIONAL",
      email: parse.str(formData.get("email")),
      phone: parse.str(formData.get("phone")),
      country: parse.str(formData.get("country")),
      notes: parse.str(formData.get("notes")),
    },
  });
  revalidatePath("/investors");
  revalidatePath(`/investors/${lpId}`);
  redirect(`/investors/${lpId}`);
}
