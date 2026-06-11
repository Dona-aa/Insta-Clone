<script>
	let { data, form } = $props();
</script>

<section class="pt-[45px]">
	<div
		class="mb-6 flex items-center justify-between gap-5 max-[800px]:flex-col max-[800px]:items-start"
	>
		<h1 class="m-0 font-serif text-[clamp(2.1rem,4.7vw,3.6rem)] leading-[1.05] tracking-[-0.1rem] text-[#171615]">
			Manage my pictures
		</h1>

		<a
			class="rounded-full bg-[#c95b39] px-4 py-2 text-sm font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326] hover:!text-white"
			href="/private/upload"
		>
			New upload
		</a>
	</div>

	{#if form?.deleted}
		<p class="rounded-[10px] bg-[#eaf6ee] px-3.5 py-3 text-sm text-[#24683e]">
			Your picture was deleted.
		</p>
	{/if}

	{#if form?.error}
		<p class="rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
			{form.error}
		</p>
	{/if}

	{#if data.images.length === 0}
		<div
			class="rounded-[18px] border border-dashed border-[#e9e2d9] bg-white px-6 py-[42px] text-center text-[#706c67]"
		>
			You have no pictures yet.
		</div>
	{:else}
		<div class="flex flex-col gap-3.5">
			{#each data.images as image (image.id)}
				<article
					class="grid grid-cols-[92px_1fr_auto] items-center gap-[18px] rounded-2xl border border-[#e9e2d9] bg-white p-3 max-[800px]:grid-cols-[72px_1fr]"
				>
					<img
						class="h-[92px] w-[92px] rounded-[11px] object-cover max-[800px]:h-[72px] max-[800px]:w-[72px]"
						src={image.image}
						alt={image.description}
					/>

					<div>
						<p class="mb-2 mt-0 text-[#171615]">{image.description}</p>
						<span class="text-[#706c67]">♥ {image.votes} votes</span>
					</div>

					<form class="max-[800px]:col-start-2" action="?/delete" method="POST">
						<input type="hidden" name="imageId" value={image.id} />

						<button
							class="cursor-pointer rounded-full border border-[#e5b9ad] bg-[#fff4f0] px-4 py-2.5 font-bold text-[#923a23] hover:bg-[#ffe5dc]"
							type="submit"
						>
							Delete
						</button>
					</form>
				</article>
			{/each}
		</div>
	{/if}
</section>