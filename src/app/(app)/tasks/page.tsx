import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, SectionCard } from "@/components/ui";
import { createTask, deleteTask, setTaskStatus } from "@/actions/tasks";
import { taskPriorityBadge, taskStatusLabels } from "@/lib/labels";
import { formatDate } from "@/lib/format";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"] as const;

export default async function TasksPage() {
  const [tasks, users, deals, companies] = await Promise.all([
    prisma.task.findMany({
      include: { assignee: true, deal: true, company: true },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
    prisma.deal.findMany({ orderBy: { companyName: "asc" }, select: { id: true, companyName: true } }),
    prisma.portfolioCompany.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Tasks" description="Firm-wide to-dos across deals and portfolio companies." />

      <div className="mb-6">
        <SectionCard title="Add a task">
          <form action={createTask} className="grid grid-cols-1 gap-2 sm:grid-cols-6">
            <input name="title" required placeholder="Task title" className="input sm:col-span-2" />
            <select name="assigneeId" defaultValue="" className="input">
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select name="priority" defaultValue="MEDIUM" className="input">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <input name="dueDate" type="date" className="input" />
            <button type="submit" className="btn-gold">
              Add task
            </button>
            <select name="dealId" defaultValue="" className="input sm:col-span-3">
              <option value="">Link to deal…</option>
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.companyName}
                </option>
              ))}
            </select>
            <select name="portfolioCompanyId" defaultValue="" className="input sm:col-span-3">
              <option value="">Link to portfolio company…</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </form>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="font-display text-base font-semibold text-ink-700">{taskStatusLabels[status]}</h3>
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.length === 0 && (
                  <p className="rounded-xl2 border border-dashed border-ink-200 p-4 text-center text-xs text-ink-400">
                    Nothing here.
                  </p>
                )}
                {columnTasks.map((task) => (
                  <div key={task.id} className="card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink-900">{task.title}</p>
                      <Badge className={taskPriorityBadge[task.priority]}>{task.priority}</Badge>
                    </div>
                    {task.description && <p className="mt-1 text-xs text-ink-400">{task.description}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
                      {task.deal && (
                        <Link href={`/deals/${task.deal.id}`} className="text-gold-600 hover:underline">
                          {task.deal.companyName}
                        </Link>
                      )}
                      {task.company && (
                        <Link href={`/portfolio/${task.company.id}`} className="text-gold-600 hover:underline">
                          {task.company.name}
                        </Link>
                      )}
                      {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                      {task.assignee && <span>· {task.assignee.name}</span>}
                    </div>
                    <div className="mt-3 flex items-center gap-2 border-t border-ink-50 pt-2 text-xs">
                      {COLUMNS.filter((s) => s !== status).map((s) => (
                        <form key={s} action={setTaskStatus.bind(null, task.id, s)}>
                          <button className="rounded-md px-2 py-1 text-ink-500 hover:bg-ink-50">
                            Move to {taskStatusLabels[s]}
                          </button>
                        </form>
                      ))}
                      <form action={deleteTask.bind(null, task.id)} className="ml-auto">
                        <button className="text-ink-300 hover:text-rose-500">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
