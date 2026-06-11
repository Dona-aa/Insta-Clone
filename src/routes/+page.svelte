<script>
	let { data } = $props();
</script>

<section
	class="flex items-end justify-between gap-7 border-b border-[#e9e2d9] py-[52px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:pt-[30px]"
>
	<div>
		<p class="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#c95b39]">
			Image Blog
		</p>

		<h1
			class="mb-3 font-serif text-[clamp(2.1rem,4.7vw,3.6rem)] leading-[1.05] tracking-[-0.1rem] text-[#171615]"
		>
			Discover everyday moments.
		</h1>

		<p class="m-0 text-[1.06rem] text-[#706c67]">
			Upload your photos, leave comments and vote for your favorites.
		</p>
	</div>

	<a
		class="rounded-full bg-[#c95b39] px-10 py-5 text-[1.75rem] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a64326] hover:text-white"
		href="/private/upload"
	>
		Share a picture
	</a>
</section>

{#if data.topImages.length > 0}
	<section class="pt-[45px]">
		<div
			class="mb-6 flex items-center justify-between gap-5 max-[800px]:flex-col max-[800px]:items-start"
		>
			<div>
				<h2 class="m-0 font-serif text-[1.8rem] tracking-[-0.05rem] text-[#171615]">
					Top pictures
				</h2>

				<p class="m-0 text-[#706c67]">Most loved by the community</p>
			</div>
		</div>

		<div class="grid grid-cols-3 gap-[22px] max-[800px]:grid-cols-1">
			{#each data.topImages as image, index (image.id)}
				<a
					class="relative overflow-hidden rounded-[18px] border border-[#e9e2d9] bg-white text-[#171615] transition hover:-translate-y-1 hover:text-[#171615] hover:shadow-[0_14px_32px_rgba(30,20,10,0.08)]"
					href="/image/{image.id}"
				>
					<span
						class="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1.5 font-bold"
					>
						#{index + 1}
					</span>

					<img
						class="h-[250px] w-full object-cover"
						src={image.image}
						alt={image.description}
					/>

					<div class="flex justify-between p-3.5">
						<span>@{image.username}</span>
						<strong>♥ {image.votes}</strong>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<section class="pt-[45px]">
	<div
		class="mb-6 flex items-center justify-between gap-5 max-[800px]:flex-col max-[800px]:items-start"
	>
		<div>
			<h2 class="m-0 font-serif text-[1.8rem] tracking-[-0.05rem] text-[#171615]">
				Latest posts
			</h2>

			<p class="m-0 text-[#706c67]">The newest images from all users</p>
		</div>
	</div>

	{#if data.images.length === 0}
		<div
			class="rounded-[18px] border border-dashed border-[#e9e2d9] bg-white px-6 py-[42px] text-center text-[#706c67]"
		>
			There are no pictures yet. Be the first to upload one.
		</div>
	{:else}
		<div class="grid grid-cols-3 gap-[22px] max-[800px]:grid-cols-1">
			{#each data.images as image (image.id)}
				<article
					class="overflow-hidden rounded-[18px] border border-[#e9e2d9] bg-white text-[#171615] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(30,20,10,0.08)]"
				>
					<a href="/image/{image.id}">
						<img
							class="aspect-square w-full object-cover"
							src={image.image}
							alt={image.description}
						/>
					</a>

					<div class="p-4">
						<a
							class="font-bold text-[#171615] hover:text-[#c95b39]"
							href="/profile/{image.author_id}"
						>
							@{image.username}
						</a>

						<p class="my-2.5 leading-[1.45] text-[#171615]">{image.description}</p>

						<a
							class="text-sm font-bold text-[#c95b39] hover:text-[#a64326]"
							href="/image/{image.id}"
						>
							♥ {image.votes} votes
						</a>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>