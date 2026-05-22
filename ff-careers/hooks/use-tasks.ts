import { useEffect, useState } from 'react';
import { getTasks, createTask } from '@/services/api';
import { auth } from '@/services/firebase';

import type { Task } from '@/services/api';

const LOCAL_STORAGE_KEY = 'ff-careers:local-tasks';

function storageKey() {
    const uid = auth.currentUser?.uid ?? 'anon';
    return `${LOCAL_STORAGE_KEY}:${uid}`;
}

function loadLocalTasks(): Task[] {
    try {
        if (typeof globalThis.localStorage === 'undefined') return [];
        const raw = globalThis.localStorage.getItem(storageKey());
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveLocalTasks(tasks: Task[]) {
    try {
        if (typeof globalThis.localStorage === 'undefined') return;
        globalThis.localStorage.setItem(storageKey(), JSON.stringify(tasks));
    } catch {
        // ignore
    }
}

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const remote = await getTasks();
            setTasks(remote);
            saveLocalTasks(remote);
            setError(null);
        } catch {
            const local = loadLocalTasks();
            setTasks(local);
            setError("Couldn't connect to server — tasks are saved locally.");
        } finally {
            setLoading(false);
        }
    }

    function toggleTask(taskId: number) {
        setTasks((current) => {
            const next = current.map((task) =>
                task.id === taskId ? { ...task, status: task.status === 'done' ? 'in_progress' : 'done' } : task
            );
            saveLocalTasks(next);
            return next;
        });
    }

    async function addTask(title: string) {
        const now = new Date().toISOString();
        const optimistic: Task = {
            id: Date.now(),
            user_id: auth.currentUser?.uid ?? 'local',
            title,
            description: null,
            status: 'in_progress',
            created_at: now,
            updated_at: now,
        };

        setTasks((current) => {
            const next = [...current, optimistic];
            saveLocalTasks(next);
            return next;
        });

        try {
            const created = await createTask(title);
            setTasks((current) => {
                const next = current.map((t) => (t.id === optimistic.id ? created : t));
                saveLocalTasks(next);
                return next;
            });
            setError(null);
        } catch (err) {
            if (err instanceof Error) console.error(err.message);
            else console.error(err);
            setError("Couldn't connect to server — tasks are saved locally.");
        }
    }

    return { tasks, loading, error, toggleTask, addTask };
}
