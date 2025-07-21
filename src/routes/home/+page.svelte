<script lang="ts">
    import { user } from "$lib/firebase";
    import { signOut, onAuthStateChanged } from "firebase/auth";
    import { auth } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import AuthCheckComponent from "$lib/components/AuthCheckComponent.svelte";
    import AllNotesComponent from "$lib/components/AllNotesComponent.svelte";
    import AddNoteComponent from "$lib/components/AddNoteComponent.svelte";

    function sighOutUser() {
        signOut(auth)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (!user) {
                        unsubscribe();
                        goto("/");
                    }
                });
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    }
</script>

<AuthCheckComponent>
    <main
        class="h-dvh w-full max-w-4xl flex flex-col items-center justify-center gap-4 p-4"
    >
        {#if $user}
            <span>Hello {$user.email}</span>
            <h1 class="mb-32 text-5xl">Welcome to your Efficiency Board</h1>
            <div
                class="flex flex-row max-w-2xl w-full justify-center items-center gap-4"
            >
                <AddNoteComponent />
                <button class="btn btn-warning flex-1" onclick={sighOutUser}
                    >Sign out</button
                >
            </div>
        {/if}
        <AllNotesComponent />
    </main>
</AuthCheckComponent>
