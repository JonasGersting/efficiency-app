<script lang="ts">
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "$lib/firebase";
    let loginDialog: HTMLDialogElement;

    export function showModal() {
        loginDialog.showModal();
    }

    let mailInput: string = $state("");
    let passwordInput: string = $state("");
    const emptyInput = $derived(!mailInput || !passwordInput);

    function login() {
        signInWithEmailAndPassword(auth, mailInput, passwordInput)
            .then((userCredential) => {
                console.log("Login successful:", userCredential.user);
                loginDialog.close();
                emptyInputs();
            })
            .catch((error) => {
                console.error("Login failed:", error);
            });
    }

    function emptyInputs() {
        mailInput = "";
        passwordInput = "";
    }
</script>

<dialog bind:this={loginDialog} class="modal modal-bottom sm:modal-middle">
    <div class="modal-box flex flex-col items-center">
        <form
            method="dialog"
            class=" flex flex-col items-center gap-8 max-w-[300px] w-full"
            action="submit"
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
            <div class="flex flex-row items-center justify-between w-full">
                <button
                    onclick={login}
                    disabled={emptyInput}
                    class="btn btn-warning">Login</button
                >
                <button class="btn">Close</button>
            </div>
        </form>
    </div>
</dialog>
