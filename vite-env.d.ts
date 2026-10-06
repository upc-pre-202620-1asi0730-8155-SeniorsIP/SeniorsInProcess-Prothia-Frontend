/**
 * Custom type definitions for the Vite environment variables.
 *
 * @remarks
 * This allows for better type checking and autocompletion when using the environment variables in the code.
 */

/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_LEARNING_PLATFORM_API_URL: string;
    /**
     * # VITE_SIGNUP_ENDPOINT_PATH is the path to the sign-up endpoint.
     */
    readonly VITE_SIGNUP_ENDPOINT_PATH: string;
    /**
     * # VITE_SIGNIN_ENDPOINT_PATH is the path to the sign-in endpoint.
     */
    readonly VITE_SIGNIN_ENDPOINT_PATH: string;
    /**
     * # VITE_USERS_ENDPOINT_PATH is the path to the users' endpoint.
     */
    readonly VITE_USERS_ENDPOINT_PATH: string;
    /**
     * # VITE_PRIME_UI_LICENSE_KEY is the license key for the Prime UI library.
     */
    readonly VITE_PRIME_UI_LICENSE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

