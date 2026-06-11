<script>
	let { data, form } = $props();
</script>

<section class="grid grid-cols-[minmax(360px,1.05fr)_minmax(300px,0.8fr)] gap-[38px] max-[800px]:grid-cols-1">
	<div>
		<img
			class="max-h-[760px] w-full rounded-[22px] object-cover"
			src={data.image.image}
			alt={data.image.description}
		/>
	</div>

	<div class="pt-2.5">
		<a
			class="font-bold text-[#171615] hover:text-[#c95b39]"
			href="/profile/{data.image.author_id}"
		>
			@{data.image.username}
		</a>

		<p class="my-[17px] mb-[26px] text-[1.12rem] leading-[1.55] text-[#171615]">
			{data.image.description}
		</p>

		<div
			class="flex items-center justify-between gap-5 border-y border-[#e9e2d9] py-[18px]"
		>
			<span class="font-bold text-[#c95b39]">♥ {data.image.votes} votes</span>

			<form action="?/upvote" method="POST">
				<button
					class="cursor-pointer rounded-full border-0 bg-[#c95b39] px-4 py-2 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326] hover:!text-white"
					type="submit"
				>
					Upvote +1
				</button>
			</form>
		</div>

		{#if form?.voteError}
			<p class="mt-4 rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
				{form.voteError}
			</p>
		{/if}

		{#if form?.voteSuccess}
			<p class="mt-4 rounded-[10px] bg-[#eaf6ee] px-3.5 py-3 text-sm text-[#24683e]">
				Your vote was saved.
			</p>
		{/if}

		{#if form?.deleteError}
			<p class="mt-4 rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
				{form.deleteError}
			</p>
		{/if}

		{#if form?.deleteSuccess}
			<p class="mt-4 rounded-[10px] bg-[#eaf6ee] px-3.5 py-3 text-sm text-[#24683e]">
				Comment was deleted.
			</p>
		{/if}

		<section class="mt-[35px]">
			<h2 class="mb-[18px] font-serif text-[1.45rem] tracking-[-0.05rem] text-[#171615]">
				Comments
			</h2>

			<form
				class="flex flex-col gap-2.5 border-b border-[#e9e2d9] pb-[25px]"
				action="?/comment"
				method="POST"
			>
				<label class="text-sm font-bold" for="text">Write a comment</label>

				<textarea
					class="w-full rounded-[11px] border border-[#e9e2d9] bg-[#fbf9f6] px-3.5 py-3 text-base focus:border-[#c95b39] focus:outline-2 focus:outline-[#efc5b6]"
					id="text"
					name="text"
					rows="3"
					maxlength="300"
					required
				></textarea>

				<button
					class="mt-2 w-fit cursor-pointer rounded-full border-0 bg-[#c95b39] px-4 py-2 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326] hover:!text-white"
					type="submit"
				>
					Post comment
				</button>
			</form>

			{#if form?.error}
				<p class="mt-4 rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
					{form.error}
				</p>
			{/if}

			<div class="flex flex-col gap-[15px] pt-[22px]">
				{#each data.comments as comment (comment.id)}
					<article class="rounded-[13px] border border-[#e9e2d9] bg-white p-4">
						<div class="flex items-center justify-between gap-3">
							<a
								class="font-bold text-[#171615] hover:text-[#c95b39]"
								href="/profile/{comment.user_id}"
							>
								@{comment.username}
							</a>

							{#if data.canDeleteComments}
								<form action="?/deleteComment" method="POST">
									<input type="hidden" name="commentId" value={comment.id} />

									<button
										class="cursor-pointer border-0 bg-transparent font-bold text-[#923a23] hover:text-[#c95b39]"
										type="submit"
									>
										Delete
									</button>
								</form>
							{/if}
						</div>

						<p class="mb-0 mt-2 leading-[1.45] text-[#171615]">{comment.text}</p>
					</article>
				{:else}
					<p class="text-[#706c67]">No comments yet.</p>
				{/each}
			</div>
		</section>
	</div>
</section>