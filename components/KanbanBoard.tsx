"use client";

import { useState } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import type { Task } from "@/types/task";
import { TASK_STATUSES } from "@/types/task";

export function KanbanBoard() {
  const [tasks] = useState<Task[]>([]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          ボード
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Todo / In Progress / Done の 3 列でタスクを管理します。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
