<script>
    import { fade } from 'svelte/transition'

    export let message
    export let type = ''
</script>

<div
    class="alert-box {type}"
    aria-live="assertive"
    role="alertdialog"
    tabindex="-1"
    in:fade|global="{{ duration: 100 }}"
    out:fade|global="{{ duration: 500 }}"
    >
    <slot>{message}</slot>
    <button
        class="close"
        aria-label="Close Alert"
        tabindex="0"
        on:click
        >
        &times;
    </button>
</div>
