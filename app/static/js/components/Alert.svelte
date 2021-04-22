<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte'

    export let message
    export let type = ''
</script>

<div class="alert-box {type}"
     tabindex="0" aria-live="assertive" role="alertdialog"
     in:fade="{{duration: 100}}"
     out:fade="{{duration: 500}}">
    <slot>{message}</slot>
    <button class="close" on:click
            tabindex="0" aria-label="Close Alert"
            >&times;</button>
</div>
