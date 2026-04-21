import { auth } from '@/services/firebase';

const BASE = process.env.NODE_ENV === "development" ? 'http://localhost:3000' : 'https://www.ffcareers.app';
console.log('API BASE:', BASE, 'NODE_ENV:', process.env.NODE_ENV);

export type Task = {
    id: number;
    user_id: string;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
};

async function authHeaders(): Promise<HeadersInit> {
    const token = await auth.currentUser?.getIdToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getUsers() {
    const res = await fetch(`${BASE}/users`, { headers: await authHeaders() });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function upsertUsers() {
    const res = await fetch(`${BASE}/users/me`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ name: auth.currentUser?.displayName, email: auth.currentUser?.email })
    })

    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function getTasks() {
    const res = await fetch(`${BASE}/tasks/me`, { headers: await authHeaders() });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function createTask(title: string) {
    const res = await fetch(`${BASE}/tasks/me`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ title, "description": null })
        }
    );
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}