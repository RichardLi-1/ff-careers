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

// TODO: wire to real backend endpoint POST /chat
export async function sendChatMessage(message: string, context?: string): Promise<string> {
    // Mock AI response while backend endpoint is not yet available
    const contextLine = context ? ` about ${context}` : '';
    const replies = [
        `Great question${contextLine}! Based on your profile, I'd recommend focusing on building practical projects to demonstrate your skills to employers.`,
        `That's something many candidates wonder about${contextLine}. The key is to highlight transferable skills and quantify your impact wherever possible.`,
        `For${contextLine ? contextLine : ' careers like this'}, networking is often the highest-leverage activity. Even a few warm introductions can accelerate your search significantly.`,
        `Your match score reflects your current profile. The fastest way to improve it is to close the top skill gaps — even a short course can shift your competitiveness meaningfully.`,
    ];
    await new Promise((r) => setTimeout(r, 900));
    return replies[Math.floor(Math.random() * replies.length)];
}