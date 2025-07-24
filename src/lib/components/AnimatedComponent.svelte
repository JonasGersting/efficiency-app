<script>
    import { fly, fade } from "svelte/transition";
    
</script>

<div class="w-full flex-1 flex flex-col items-center justify-center gap-4" in:fly={{  y: '100%', duration: 500 }} out:fade>
    <slot />
</div>