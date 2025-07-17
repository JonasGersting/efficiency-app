<script>
    import { fly, fade } from "svelte/transition";
    
</script>

<div in:fly={{  y: '100%', duration: 500 }} out:fade>
    <slot />
</div>