"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, parse } from "./session";

export async function createTask(formData: FormData) {
  await requireUser();
  const dealId = parse.str(formData.get("dealId"));
  const portfolioCompanyId = parse.str(formData.get("portfolioCompanyId"));

  await prisma.task.create({
    data: {
      title: parse.str(formData.get("title")) ?? "Untitled task",
      description: parse.str(formData.get("description")),
      status: (parse.str(formData.get("status")) as any) ?? "TODO",
      priority: (parse.str(formData.get("priority")) as any) ?? "MEDIUM",
      dueDate: parse.date(formData.get("dueDate")),
      assigneeId: parse.str(formData.get("assigneeId")),
      dealId,
      portfolioCompanyId,
    },
  });

  revalidatePath("/tasks");
  if (dealId) revalidatePath(`/deals/${dealId}`);
  if (portfolioCompanyId) revalidatePath(`/portfolio/${portfolioCompanyId}`);
}

export async function setTaskStatus(taskId: string, status: string) {
  await requireUser();
  const task = await prisma.task.update({ where: { id: taskId }, data: { status: status as any } });
  revalidatePath("/tasks");
  if (task.dealId) revalidatePath(`/deals/${task.dealId}`);
  if (task.portfolioCompanyId) revalidatePath(`/portfolio/${task.portfolioCompanyId}`);
}

export async function deleteTask(taskId: string) {
  await requireUser();
  const task = await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/tasks");
  if (task.dealId) revalidatePath(`/deals/${task.dealId}`);
  if (task.portfolioCompanyId) revalidatePath(`/portfolio/${task.portfolioCompanyId}`);
}
