<script>
	let { data } = $props();
</script>

<section class="profile-header">
	<div class="avatar">{data.profile.username.charAt(0).toUpperCase()}</div>

	<div>
		<p class="eyebrow">Profile</p>
		<h1>@{data.profile.username}</h1>
		<p class="muted">{data.images.length} uploaded pictures</p>
	</div>
</section>

{#if data.images.length === 0}
	<div class="empty-state">This user has not uploaded any pictures yet.</div>
{:else}
	<div class="image-grid">
		{#each data.images as image (image.id)}
			<a class="profile-picture" href="/image/{image.id}">
				<img src={image.image} alt={image.description} />
				<div class="overlay">♥ {image.votes}</div>
			</a>
		{/each}
	</div>
{/if}