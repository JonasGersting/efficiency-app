<script lang="ts">
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { app } from "$lib/firebase"; // Ensure you have initialized Firebase in this file
    import { auth } from "$lib/firebase"; // Import auth from your firebase setup
    let loginDialog: HTMLDialogElement;

    let mailInput = $state("");
    let passwordInput = $state("");
    let repeatPasswordInput = $state("");
    let errorMessage = $state("");
    let { onRegisterSuccess } = $props<{ onRegisterSuccess: () => void }>();

    const emptyInput = $derived(
        !mailInput || !passwordInput || !repeatPasswordInput,
    );

    const passwordsDoNotMatch = $derived(
        passwordInput !== repeatPasswordInput && repeatPasswordInput !== "",
    );

    async function handleRegister() {
        errorMessage = "";
        if (emptyInput || passwordsDoNotMatch) {
            errorMessage = "Please fill in all fields correctly.";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                mailInput,
                passwordInput,
            );
            console.log(
                "Benutzer erfolgreich registriert:",
                userCredential.user,
            );
            loginDialog.close();
            onRegisterSuccess();
            emptyInputs();
        } catch (error: any) {
            switch (error.code) {
                case "auth/weak-password":
                    errorMessage =
                        "Das Passwort ist zu schwach (mindestens 6 Zeichen).";
                    break;
                case "auth/email-already-in-use":
                    errorMessage =
                        "Diese E-Mail-Adresse wird bereits verwendet.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Bitte gib eine gültige E-Mail-Adresse ein.";
                    break;
                default:
                    errorMessage = "Ein unbekannter Fehler ist aufgetreten.";
                    break;
            }
            console.error("Firebase Fehler:", error);
        }
    }

    function emptyInputs() {
        mailInput = "";
        passwordInput = "";
        repeatPasswordInput = "";
    }

    export function showModal() {
        loginDialog.showModal();
    }
</script>

<dialog bind:this={loginDialog} class="modal modal-bottom sm:modal-middle">
    <div class="modal-box flex flex-col items-center">
        <form
            method="dialog"
            class=" flex flex-col items-center gap-8 max-w-[300px] w-full"
        >
            <input
                bind:value={mailInput}
                type="text"
                placeholder="E-Mail"
                class="input input-warning focus:outline-none"
            />
            <input
                bind:value={passwordInput}
                type="text"
                placeholder="Passwort"
                class="input input-warning focus:outline-none"
            />
            <input
                bind:value={repeatPasswordInput}
                type="text"
                placeholder="Passwort wiederholen"
                class="input input-warning focus:outline-none"
            />
            {#if errorMessage}
                <p class="text-error">{errorMessage}</p>
            {/if}
            <div class="flex flex-row items-center justify-between w-full">
                <button
                    type="button"
                    disabled={emptyInput || passwordsDoNotMatch}
                    onclick={handleRegister}
                    class="btn btn-warning">Register</button
                >
                <button class="btn">Close</button>
            </div>
        </form>
    </div>
</dialog>
