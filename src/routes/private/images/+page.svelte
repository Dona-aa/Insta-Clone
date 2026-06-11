<script>
	let { data, form } = $props();
</script>

<section class="section">
	<div class="section-heading">
		<h1>Manage my pictures</h1>
		<a class="button small" href="/private/upload">New upload</a>
	</div>

	{#if form?.deleted}
		<p class="success">Your picture was deleted.</p>
	{/if}

	{#if form?.error}
		<p class="alert">{form.error}</p>
	{/if}

	{#if data.images.length === 0}
		<div class="empty-state">You have no pictures yet.</div>
	{:else}
		<div class="manage-list">
			{#each data.images as image (image.id)}
				<article class="manage-card">
					<img src={image.image} alt={image.description} />

					<div>
						<p>{image.description}</p>
						<span class="muted">♥ {image.votes} votes</span>
					</div>

					<form action="?/delete" method="POST">
						<input type="hidden" name="imageId" value={image.id} />
						<button class="danger-button" type="submit">Delete</button>
					</form>
				</article>
			{/each}
		</div>
	{/if}
</section>