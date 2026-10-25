// The Live Tutor talks directly to the engineer-playbook-poc Express backend
// on Render, not a local Next.js API route. Override via NEXT_PUBLIC_API_URL
// if the backend ever moves.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://engineer-playbook-poc.onrender.com';
