const BASE = process.env.NODE_ENV === "development" ? 'https://localhost:3000' : "https://www.ffcareers.app/"

export async function getUsers() {
    const res = await fetch('${BASE}/users')
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function getTasks() {
    const res = await fetch('${BASE}/tasks/me')
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}

export async function createTask() {
    const res = await fetch('${BASE}/tasks/me', {
        method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "Richard",
                age: 19
            })
        }
    );
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
}