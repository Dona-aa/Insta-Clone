<script>
	import '../app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>PixelPost</title>
</svelte:head>

<header class="sticky top-0 z-20 border-b border-[#e9e2d9] bg-[#fbf9f6]/95 backdrop-blur-xl">
	<nav
		class="mx-auto flex min-h-[70px] w-[min(1120px,calc(100%-32px))] items-center justify-between gap-6 max-[800px]:flex-col max-[800px]:items-start max-[800px]:py-4"
	>
		<a class="font-serif text-[1.6rem] font-bold tracking-[-0.06rem] hover:text-[#c95b39]" href="/">
			PixelPost
		</a>

		<div class="flex items-center gap-[22px] text-[0.95rem] max-[800px]:flex-wrap max-[800px]:gap-x-[18px] max-[800px]:gap-y-[13px]">
			<a class="hover:text-[#c95b39]" href="/">Explore</a>

			{#if data.user}
				<a class="hover:text-[#c95b39]" href="/profile/{data.user.id}">My Profile</a>

				<a
					class="rounded-full bg-[#c95b39] px-5 py-3 font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326]"
					href="/private/upload"
				>
					Upload
				</a>

				<a class="hover:text-[#c95b39]" href="/private/images">Manage</a>

				<form class="m-0" action="/logout?/logout" method="POST">
					<button class="cursor-pointer border-0 bg-transparent font-inherit hover:text-[#c95b39]" type="submit">
						Logout
					</button>
				</form>
			{:else}
				<a class="hover:text-[#c95b39]" href="/login">Login</a>

				<a
					class="rounded-full bg-[#c95b39] px-5 py-3 font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326]"
					href="/register"
				>
					Register
				</a>
			{/if}
		</div>
	</nav>
</header>

<main class="mx-auto min-h-[calc(100vh-160px)] w-[min(1120px,calc(100%-32px))] py-[38px] pb-16">
	{@render children()}
</main>

<footer class="border-t border-[#e9e2d9] py-[30px]">
	<div
		class="mx-auto flex w-[min(1120px,calc(100%-32px))] items-center justify-between text-[#706c67] max-[800px]:flex-col max-[800px]:items-start"
	>
		<p class="m-0 font-serif text-[1.6rem] font-bold tracking-[-0.06rem] text-[#171615]">
			PixelPost
		</p>
		<p>Share pictures. Discover moments.</p>
	</div>
</footer>