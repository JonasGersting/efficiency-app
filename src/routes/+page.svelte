<script lang="ts">
    import LoginDialog from "$lib/components/LoginDialog.svelte";
    import RegisterDialog from "$lib/components/RegisterDialog.svelte";
    import AnimatedComponent from "$lib/components/AnimatedComponent.svelte";
    import RegisterSuccess from "$lib/components/RegisterSuccess.svelte";

    let showSuccess = $state(false);
</script>

<main
    class="h-dvh max-w-4xl w-full items-center flex flex-col justify-center gap-4 p-4"
>
    <h1 class="mb-32 text-5xl">Login</h1>
    <div class="w-full flex gap-4">
        <LoginDialog />
        <RegisterDialog bind:showSuccess />
    </div>

    {#if showSuccess}
        <div
            class="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 overflow-y-hidden"
        >
            <AnimatedComponent>
                <RegisterSuccess />
            </AnimatedComponent>
        </div>
    {/if}
</main>

