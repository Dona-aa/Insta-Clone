<script>
	let { data, form } = $props();
</script>

<section>
	<div
		class="mb-8 flex items-end justify-between gap-5 border-b border-[#e9e2d9] pb-8 max-[800px]:flex-col max-[800px]:items-start"
	>
		<div>
			<p class="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#c95b39]">
				Admin area
			</p>

			<h1
				class="mb-3 font-serif text-[clamp(2.1rem,4.7vw,3.6rem)] leading-[1.05] tracking-[-0.1rem] text-[#171615]"
			>
				Manage PixelPost
			</h1>

			<p class="m-0 text-[#706c67]">
				Ban users, remove posts and moderate comments.
			</p>
		</div>
	</div>

	{#if form?.error}
		<p class="mb-5 rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
			{form.error}
		</p>
	{/if}

	{#if form?.success}
		<p class="mb-5 rounded-[10px] bg-[#eaf6ee] px-3.5 py-3 text-sm text-[#24683e]">
			{form.success}
		</p>
	{/if}

	<div class="mb-10 grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
		<div class="rounded-[18px] border border-[#e9e2d9] bg-white p-5">
			<p class="m-0 text-sm font-bold uppercase tracking-[0.12em] text-[#c95b39]">Users</p>
			<strong class="mt-3 block font-serif text-4xl text-[#171615]">{data.stats.userCount}</strong>
		</div>

		<div class="rounded-[18px] border border-[#e9e2d9] bg-white p-5">
			<p class="m-0 text-sm font-bold uppercase tracking-[0.12em] text-[#c95b39]">Posts</p>
			<strong class="mt-3 block font-serif text-4xl text-[#171615]">{data.stats.imageCount}</strong>
		</div>

		<div class="rounded-[18px] border border-[#e9e2d9] bg-white p-5">
			<p class="m-0 text-sm font-bold uppercase tracking-[0.12em] text-[#c95b39]">
				Comments
			</p>
			<strong class="mt-3 block font-serif text-4xl text-[#171615]">{data.stats.commentCount}</strong>
		</div>
	</div>

	<section class="mb-12">
		<h2 class="mb-5 font-serif text-[1.8rem] tracking-[-0.05rem] text-[#171615]">
			Users
		</h2>

		<div class="flex flex-col gap-3.5">
			{#each data.users as user (user.id)}
				<article
					class="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[18px] border border-[#e9e2d9] bg-white p-4 max-[800px]:grid-cols-1"
				>
					<div>
						<p class="m-0 font-bold text-[#171615]">@{user.username}</p>
						<p class="m-0 text-sm text-[#706c67]">{user.email}</p>

						<div class="mt-2 flex gap-2">
							<span
								class="rounded-full bg-[#f2ede7] px-3 py-1 text-xs font-bold text-[#171615]"
							>
								{user.role}
							</span>

							{#if user.is_banned === 1}
								<span
									class="rounded-full bg-[#fff0eb] px-3 py-1 text-xs font-bold text-[#923a23]"
								>
									banned
								</span>
							{:else}
								<span
									class="rounded-full bg-[#eaf6ee] px-3 py-1 text-xs font-bold text-[#24683e]"
								>
									active
								</span>
							{/if}
						</div>
					</div>

					<div>
						{#if user.role !== 'admin'}
							{#if user.is_banned === 1}
								<form action="?/unbanUser" method="POST">
									<input type="hidden" name="userId" value={user.id} />
									<button
										class="cursor-pointer rounded-full border border-[#cce8d5] bg-[#eaf6ee] px-4 py-2.5 font-bold text-[#24683e] hover:bg-[#dff1e5]"
										type="submit"
									>
										Unban
									</button>
								</form>
							{:else}
								<form action="?/banUser" method="POST">
									<input type="hidden" name="userId" value={user.id} />
									<button
										class="cursor-pointer rounded-full border border-[#e5b9ad] bg-[#fff4f0] px-4 py-2.5 font-bold text-[#923a23] hover:bg-[#ffe5dc]"
										type="submit"
									>
										Ban
									</button>
								</form>
							{/if}
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="mb-12">
		<h2 class="mb-5 font-serif text-[1.8rem] tracking-[-0.05rem] text-[#171615]">
			Posts
		</h2>

		<div class="grid grid-cols-3 gap-[22px] max-[800px]:grid-cols-1">
			{#each data.images as image (image.id)}
				<article
					class="overflow-hidden rounded-[18px] border border-[#e9e2d9] bg-white text-[#171615]"
				>
					<a href="/image/{image.id}">
						<img
							class="aspect-square w-full object-cover"
							src={image.image}
							alt={image.description}
						/>
					</a>

					<div class="p-4">
						<p class="m-0 font-bold">@{image.username}</p>
						<p class="my-2.5 leading-[1.45]">{image.description}</p>
						<p class="m-0 text-sm font-bold text-[#c95b39]">♥ {image.votes} votes</p>

						<form class="mt-4" action="?/deleteImage" method="POST">
							<input type="hidden" name="imageId" value={image.id} />

							<button
								class="cursor-pointer rounded-full border border-[#e5b9ad] bg-[#fff4f0] px-4 py-2.5 font-bold text-[#923a23] hover:bg-[#ffe5dc]"
								type="submit"
							>
								Delete post
							</button>
						</form>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="mb-5 font-serif text-[1.8rem] tracking-[-0.05rem] text-[#171615]">
			Comments
		</h2>

		<div class="flex flex-col gap-3.5">
			{#each data.comments as comment (comment.id)}
				<article class="rounded-[13px] border border-[#e9e2d9] bg-white p-4">
					<div class="flex items-start justify-between gap-4 max-[800px]:flex-col">
						<div>
							<a
								class="font-bold text-[#171615] hover:text-[#c95b39]"
								href="/image/{comment.image_id}"
							>
								@{comment.username}
							</a>

							<p class="mb-0 mt-2 leading-[1.45] text-[#171615]">{comment.text}</p>
						</div>

						<form action="?/deleteComment" method="POST">
							<input type="hidden" name="commentId" value={comment.id} />

							<button
								class="cursor-pointer rounded-full border border-[#e5b9ad] bg-[#fff4f0] px-4 py-2.5 font-bold text-[#923a23] hover:bg-[#ffe5dc]"
								type="submit"
							>
								Delete
							</button>
						</form>
					</div>
				</article>
			{:else}
				<div
					class="rounded-[18px] border border-dashed border-[#e9e2d9] bg-white px-6 py-[42px] text-center text-[#706c67]"
				>
					There are no comments yet.
				</div>
			{/each}
		</div>
	</section>
</section>