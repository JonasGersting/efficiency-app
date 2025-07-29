import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Prüft, ob die userID vom Hook gesetzt wurde.
    if (locals.userID) {
        console.log('User is already logged in with userID:', locals.userID);
        
        // Wenn ja, wird der Benutzer nach /home umgeleitet.
        throw redirect(303, '/home');
    }
};