import { Api } from "./services/Api.ts";
import { tokenStorage, TOKEN_KEY } from "./atoms/atoms.ts";

// URL prefix for own server
// This is to protect us from accidently sending the JWT to 3rd party services.
const AUTHORIZE_ORIGIN = "/";
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const _api = new Api({ baseURL: BACKEND_URL});

_api.instance.interceptors.request.use((config) => {
    // Get the JWT from storage.
    const jwt = tokenStorage.getItem(TOKEN_KEY, null);
    // Add Authorization header if we have a JWT and the request goes to our own
    // server.
    if (jwt && config.url?.startsWith(AUTHORIZE_ORIGIN)) {
        // Set Authorization header, so server can tell who is logged in.
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});

// Expose API-client which will handle authorization.
export const http = _api.api;
