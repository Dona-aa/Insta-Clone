<script>
	let { data } = $props();
</script>

<section class="hero">
	<div>
		<p class="eyebrow">Image Blog</p>
		<h1>Discover everyday moments.</h1>
		<p class="hero-text">Upload your photos, leave comments and vote for your favorites.</p>
	</div>

	<a class="button" href="/private/upload">Share a picture</a>
</section>

{#if data.topImages.length > 0}
	<section class="section">
		<div class="section-heading">
			<h2>Top pictures</h2>
			<p>Most loved by the community</p>
		</div>

		<div class="top-grid">
			{#each data.topImages as image, index (image.id)}
				<a class="top-card" href="/image/{image.id}">
					<span class="rank">#{index + 1}</span>
					<img src={image.image} alt={image.description} />

					<div class="card-info">
						<span>@{image.username}</span>
						<strong>♥ {image.votes}</strong>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<section class="section">
	<div class="section-heading">
		<h2>Latest posts</h2>
		<p>The newest images from all users</p>
	</div>

	{#if data.images.length === 0}
		<div class="empty-state">There are no pictures yet. Be the first to upload one.</div>
	{:else}
		<div class="image-grid">
			{#each data.images as image (image.id)}
				<article class="post-card">
					<a href="/image/{image.id}">
						<img src={image.image} alt={image.description} />
					</a>

					<div class="post-content">
						<a class="username" href="/profile/{image.author_id}">@{image.username}</a>
						<p>{image.description}</p>
						<a class="votes" href="/image/{image.id}">♥ {image.votes} votes</a>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>