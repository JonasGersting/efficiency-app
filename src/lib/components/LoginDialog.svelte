<script lang="ts">
    import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
    import { auth } from "$lib/firebase";
    import { goto } from "$app/navigation";

    let mailInput: string = $state("");
    let passwordInput: string = $state("");
    const emptyInput = $derived(!mailInput || !passwordInput);

    function login() {
        signInWithEmailAndPassword(auth, mailInput, passwordInput)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        unsubscribe();
                        emptyInputs();
                        goto("/home");
                    }
                });
            })
            .catch((error) => {
                console.error("Login failed:", error);
            });
    }

    function emptyInputs() {
        mailInput = "";
        passwordInput = "";
    }


    function showLoginDialog() {
        let loginDialog = document.getElementById(
            "login-dialog",
        ) as HTMLDialogElement;
        loginDialog.showModal();
    }
</script>

<button class="btn btn-warning flex-1" onclick={showLoginDialog}>Login</button>
<dialog id="login-dialog" class="modal modal-bottom sm:modal-middle">
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
