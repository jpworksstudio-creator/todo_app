import type { Task, TaskStatus } from "@/types/task";
import { STATUS_LABELS } from "@/types/task";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
};

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  return (
    <section className="flex min-h-64 flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {STATUS_LABELS[status]}
        </h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </header>
      <div className="flex flex-1 items-center justify-center p-4">
        {tasks.length > 0 ? (
          <div className="w-full space-y-3">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="text-sm font-medium">{task.title}</h3>
                {task.description ? (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {task.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            タスクはまだありません
          </p>
        )}
      </div>
    </section>
  );
}
