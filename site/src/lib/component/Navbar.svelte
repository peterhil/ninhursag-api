<script>
	import Octocat from '$component/Octocat.svelte'

	let { controls } = $props()
</script>

<nav class="navigation">
	<section class="name">
		<h1>
			<a href="/">Ninhursag</a>
		</h1>
		<a href="/about/">About</a>
	</section>
	<section>
		{@render controls()}
	</section>
	<Octocat />
</nav>
