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

		{#if form?.deleteError}
			<p class="alert small-alert">{form.deleteError}</p>
		{/if}

		{#if form?.deleteSuccess}
			<p class="success">Comment was deleted.</p>
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
						<div class="comment-top">
							<a href="/profile/{comment.user_id}">@{comment.username}</a>

							{#if data.canDeleteComments}
								<form action="?/deleteComment" method="POST">
									<input type="hidden" name="commentId" value={comment.id} />
									<button class="comment-delete" type="submit">Delete</button>
								</form>
							{/if}
						</div>

						<p>{comment.text}</p>
					</article>
				{:else}
					<p class="muted">No comments yet.</p>
				{/each}
			</div>
		</section>
	</div>
</section>