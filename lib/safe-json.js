export async function readJsonResponse(response) {
    const text = await response.text();
    if (!text.trim())
        return null;
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}
