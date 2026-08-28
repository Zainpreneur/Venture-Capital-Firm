import { createTask, deleteTask, setTaskStatus } from "@/actions/tasks";
import { taskPriorityBadge, taskStatusBadge, taskStatusLabels } from "@/lib/labels";
import { formatDate, initials } from "@/lib/format";

type TaskItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  assignee: { name: string; colorTag: string } | null;
};

export function TasksPanel({
  tasks,
  users,
  dealId,
  portfolioCompanyId,
}: {
  tasks: TaskItem[];
  users: { id: string; name: string }[];
  dealId?: string;
  portfolioCompanyId?: string;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-800">Tasks</h2>

      <form action={createTask} className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        {dealId && <input type="hidden" name="dealId" value={dealId} />}
        {portfolioCompanyId && (
          <input type="hidden" name="portfolioCompanyId" value={portfolioCompanyId} />
        )}
        <input name="title" required placeholder="New task…" className="input" />
        <select name="assigneeId" className="input" defaultValue="">
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <input name="dueDate" type="date" className="input" />
        <button type="submit" className="btn-outline">
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-sm text-ink-400">No tasks yet.</p>
      ) : (
        <ul className="divide-y divide-ink-50">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-2.5">
              <form action={setTaskStatus.bind(null, task.id, task.status === "DONE" ? "TODO" : "DONE")}>
                <button
                  type="submit"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    task.status === "DONE"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-ink-300 text-transparent hover:border-ink-400"
                  }`}
                >
                  ✓
                </button>
              </form>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${
                    task.status === "DONE" ? "text-ink-300 line-through" : "text-ink-800"
                  }`}
                >
                  {task.title}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
                  <span className={`badge ${taskPriorityBadge[task.priority]}`}>{task.priority}</span>
                  {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                  {task.assignee && <span>· {task.assignee.name}</span>}
                </div>
              </div>
              <span className={`badge shrink-0 ${taskStatusBadge[task.status]}`}>
                {taskStatusLabels[task.status]}
              </span>
              <form action={deleteTask.bind(null, task.id)}>
                <button className="text-xs text-ink-300 hover:text-rose-500">✕</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
