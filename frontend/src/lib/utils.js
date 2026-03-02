import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getFullImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

    // Normalize path: Replace backslashes (Windows) with forward slashes 
    // and remove 'public/' prefix if the server saves it that way
    const cleanPath = path.replace(/\\/g, '/').replace(/^public\//, '');

    return `${baseUrl}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
}
