export async function loadJSON<T>(path: string): Promise<T> {
    const response = await fetch(path);
    return response.json();
}