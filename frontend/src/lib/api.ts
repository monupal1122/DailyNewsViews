const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchApi(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    console.log("api working",response)
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}
