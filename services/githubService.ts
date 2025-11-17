import { GithubUser, Gist } from '../types';

const API_BASE_URL = 'https://api.github.com';

const makeRequest = async (endpoint: string, token: string, options: RequestInit = {}): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`GitHub API Error: ${errorData.message || 'Unknown error'}`);
    }
    return response.json();
};

export const getUser = (token: string): Promise<GithubUser> => {
    return makeRequest('/user', token);
};

export const getGists = (token: string): Promise<Gist[]> => {
    return makeRequest('/gists', token);
};

export const getGistContent = async (raw_url: string, token: string): Promise<string> => {
    const response = await fetch(raw_url, {
        headers: { 'Authorization': `token ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch Gist content');
    return response.text();
};

export const createGist = (description: string, filename: string, content: string, isPublic: boolean, token: string): Promise<Gist> => {
    return makeRequest('/gists', token, {
        method: 'POST',
        body: JSON.stringify({
            description,
            public: isPublic,
            files: {
                [filename]: { content },
            },
        }),
    });
};

export const updateGist = async (gistId: string, content: string, token: string): Promise<Gist> => {
    // We need to know the original filename to update it.
    // For simplicity in this app, we'll fetch the gist first to get the filename.
    // A more optimized approach might store the filename when the gist is loaded.
    const gist: Gist = await makeRequest(`/gists/${gistId}`, token);
    const filename = Object.keys(gist.files)[0];
    if (!filename) throw new Error('Cannot update a Gist with no files.');

    return makeRequest(`/gists/${gistId}`, token, {
        method: 'PATCH',
        body: JSON.stringify({
            files: {
                [filename]: { content },
            },
        }),
    });
};