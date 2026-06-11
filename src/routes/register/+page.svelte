<script>
	let { form } = $props();
</script>

<section class="grid place-items-center pt-7">
	<div
		class="w-full max-w-[460px] rounded-[22px] border border-[#e9e2d9] bg-white p-10 max-[800px]:px-5 max-[800px]:py-7"
	>
		<p class="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#c95b39]">
			New account
		</p>

		<h1 class="mb-3 font-serif text-[2.35rem] leading-[1.05] tracking-[-0.1rem] text-[#171615]">
			Join PixelPost
		</h1>

		<p class="m-0 text-[#706c67]">
			Create an account to upload, comment and upvote pictures.
		</p>

		{#if form?.error}
			<p class="mt-5 rounded-[10px] bg-[#fff0eb] px-3.5 py-3 text-sm text-[#923a23]">
				{form.error}
			</p>
		{/if}

		<form class="mt-7 flex flex-col gap-2.5" action="?/register" method="POST">
			<label class="mt-2 text-sm font-bold" for="username">Username</label>
			<input
				class="w-full rounded-[11px] border border-[#e9e2d9] bg-[#fbf9f6] px-3.5 py-3 text-base focus:border-[#c95b39] focus:outline-2 focus:outline-[#efc5b6]"
				id="username"
				name="username"
				type="text"
				value={form?.username ?? ''}
				required
			/>

			<label class="mt-2 text-sm font-bold" for="email">Email</label>
			<input
				class="w-full rounded-[11px] border border-[#e9e2d9] bg-[#fbf9f6] px-3.5 py-3 text-base focus:border-[#c95b39] focus:outline-2 focus:outline-[#efc5b6]"
				id="email"
				name="email"
				type="email"
				value={form?.email ?? ''}
				required
			/>

			<label class="mt-2 text-sm font-bold" for="password">Password</label>
			<input
				class="w-full rounded-[11px] border border-[#e9e2d9] bg-[#fbf9f6] px-3.5 py-3 text-base focus:border-[#c95b39] focus:outline-2 focus:outline-[#efc5b6]"
				id="password"
				name="password"
				type="password"
				required
			/>

			<button
				class="mt-5 cursor-pointer rounded-full border-0 bg-[#c95b39] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a64326]"
				type="submit"
			>
				Create account
			</button>
		</form>

		<p class="mt-6 text-center text-[#706c67]">
			Already registered?
			<a class="font-bold text-[#c95b39] hover:text-[#a64326]" href="/login">Log in</a>
		</p>
	</div>
</section>