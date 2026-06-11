<script>
	let { data, form } = $props();
</script>

<section class="detail-grid">
	<div class="detail-image">
		<img src={data.image.image} alt={data.image.description} />
	</div>

	<div class="detail-content">
		<a class="username" href="/profile/{data.image.author_id}">@{data.image.username}</a>

		<p class="description">{data.image.description}</p>

		<div class="vote-row">
			<span class="vote-total">♥ {data.image.votes} votes</span>

			<form action="?/upvote" method="POST">
				<button class="button small" type="submit">Upvote +1</button>
			</form>
		</div>

		{#if form?.voteError}
			<p class="alert small-alert">{form.voteError}</p>
		{/if}

		{#if form?.voteSuccess}
			<p class="success">Your vote was saved.</p>
		{/if}

		<section class="comments">
			<h2>Comments</h2>

			<form class="comment-form" action="?/comment" method="POST">
				<label for="text">Write a comment</label>
				<textarea id="text" name="text" rows="3" maxlength="300" required></textarea>

				<button class="button small" type="submit">Post comment</button>
			</form>

			{#if form?.error}
				<p class="alert small-alert">{form.error}</p>
			{/if}

			<div class="comment-list">
				{#each data.comments as comment (comment.id)}
					<article class="comment">
						<a href="/profile/{comment.user_id}">@{comment.username}</a>
						<p>{comment.text}</p>
					</article>
				{:else}
					<p class="muted">No comments yet.</p>
				{/each}
			</div>
		</section>
	</div>
</section>