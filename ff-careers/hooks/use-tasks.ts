import { useEffect, useState } from 'react';
import { getTasks, createTask } from '@/services/api';

import type { Task } from '@/services/api';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        getTasks()
            .then(setTasks)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }

    function toggleTask(taskId: number) {
        setTasks((current) =>
            current.map((task) =>
                task.id === taskId ? { ...task, status: task.status === 'done' ? 'in_progress' : 'done' } : task
            )
        );
    }

    async function addTask(title: string) {
        try {
            const newTaskDetails = await createTask(title);
            setTasks((current) => [...current, newTaskDetails]);
            fetchTasks();
        }
        catch (err) {
            if (err instanceof Error ) ( console.error(err.message));
            else console.error(err);
        }
        
    }

    return { tasks, loading, error, toggleTask, addTask };
}

