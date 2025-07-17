<script lang="ts">
    import LoginDialog from "$lib/components/LoginDialog.svelte";
    import RegisterDialog from "$lib/components/RegisterDialog.svelte";
    import AnimatedComponent from "$lib/components/AnimatedComponent.svelte";
    import RegisterSuccess from "$lib/components/RegisterSuccess.svelte";
    let loginDialogComponent: LoginDialog;
    let registerDialogComponent: RegisterDialog;
    let showSuccess: boolean = $state(false);

    function showLoginDialog() {
        loginDialogComponent.showModal();
    }

    function showRegisterDialog() {
        registerDialogComponent.showModal();
    }

    function handleRegisterSuccess() {
        showSuccess = true;
        setTimeout(() => {
            showSuccess = false;
        }, 3000);
    }
</script>

<main
    class="h-dvh w-full max-w-4xl flex flex-col items-center justify-center gap-4 p-4"
>
    <h1 class="mb-32 text-5xl">Welcome to your efficiency-board</h1>
    <div class="w-full flex flex-row gap-2 max-w-300 justify-around">
        <button class="btn btn-warning w-3xs" onclick={showLoginDialog}
            >Login</button
        >
        <LoginDialog bind:this={loginDialogComponent} />
        <button class="btn btn-warning w-3xs" onclick={showRegisterDialog}
            >Register</button
        >
        <RegisterDialog
            bind:this={registerDialogComponent}
            onRegisterSuccess={handleRegisterSuccess}
        />
    </div>
   
    {#if showSuccess}
        <div class="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 overflow-y-hidden">
            <AnimatedComponent>
                <RegisterSuccess />
            </AnimatedComponent>
        </div>
    {/if}
</main>
