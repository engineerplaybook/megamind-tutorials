// The tipc-bot UI talks directly to the already-deployed engineer-playbook-poc
// Express backend on Render, not a local Next.js API route — same backend
// engineer-playbook-poc/client uses. Override via NEXT_PUBLIC_API_URL if the
// backend ever moves.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://engineer-playbook-poc.onrender.com';
