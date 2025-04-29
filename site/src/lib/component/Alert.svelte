<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { fade } from 'svelte/transition'

	interface Props {
		message: any;
		type?: string;
		children?: import('svelte').Snippet;
	}

	let { message, type = '', children }: Props = $props();
</script>

<div
	class="alert {type}"
	aria-live="assertive"
	role="alertdialog"
	tabindex="-1"
	in:fade|global="{{ duration: 100 }}"
	out:fade|global="{{ duration: 250 }}"
	>
	<button
		class="button button-clear close"
		aria-label="Close Alert"
		onclick={bubble('click')}
		tabindex="0"
			>&times;</button>
	{#if children}{@render children()}{:else}{message}{/if}
</div>
