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
     * Platform URL for Clinical Bounded Context (Patients, Exercises, Prescriptions).
     */
    readonly VITE_CLINICAL_API_URL?: string;
    /**
     * Platform URL for Workshop Bounded Context (Prostheses, Alerts, Maintenance Schedules).
     */
    readonly VITE_WORKSHOP_API_URL?: string;
    /**
     * Platform URL for Monitoring and Options Bounded Context (Alerts, Thresholds, Options).
     */
    readonly VITE_MONITORING_API_URL?: string;
    /**
     * Platform URL for IAM and Communication Bounded Context (Authentication, Users, Messages).
     */
    readonly VITE_IAM_API_URL?: string;
    /**
     * Default Platform API URL fallback.
     */
    readonly VITE_PROTHIA_PLATFORM_API_URL?: string;
    readonly VITE_PROTHIA_PLATFORM_API_URL_1?: string;
    readonly VITE_PROTHIA_PLATFORM_API_URL_2?: string;
    readonly VITE_PROTHIA_PLATFORM_API_URL_3?: string;
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

