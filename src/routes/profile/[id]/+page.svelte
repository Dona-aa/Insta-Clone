<script>
	let { data } = $props();
</script>

<section class="mb-11 flex items-center gap-6">
	<div
		class="grid h-[92px] w-[92px] place-items-center rounded-full bg-[#f2ede7] font-serif text-[2.5rem] text-[#c95b39]"
	>
		{data.profile.username.charAt(0).toUpperCase()}
	</div>

	<div>
		<p class="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#c95b39]">
			Profile
		</p>

		<h1 class="mb-3 font-serif text-[2.5rem] leading-[1.05] tracking-[-0.1rem] text-[#171615]">
			@{data.profile.username}
		</h1>

		<p class="m-0 text-[#706c67]">{data.images.length} uploaded pictures</p>
	</div>
</section>

{#if data.images.length === 0}
	<div
		class="rounded-[18px] border border-dashed border-[#e9e2d9] bg-white px-6 py-[42px] text-center text-[#706c67]"
	>
		This user has not uploaded any pictures yet.
	</div>
{:else}
	<div class="grid grid-cols-3 gap-[22px] max-[800px]:grid-cols-1">
		{#each data.images as image (image.id)}
			<a
				class="relative overflow-hidden rounded-[17px] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(30,20,10,0.08)]"
				href="/image/{image.id}"
			>
				<img
					class="aspect-square w-full object-cover"
					src={image.image}
					alt={image.description}
				/>

				<div
					class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3.5 pt-7 font-bold !text-white"
				>
					♥ {image.votes}
				</div>
			</a>
		{/each}
	</div>
{/if}