// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            userID: string | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
    namespace svelte.JSX {
        interface SVGAttributes {
            slot?: string;
        }
    }
}

export {};