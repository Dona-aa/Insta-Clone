<script>
	import '../app.css';
	import { page } from '$app/state';

	let { children, data } = $props();

	function isActive(path) {
		return page.url.pathname === path;
	}

	function startsWith(path) {
		return page.url.pathname.startsWith(path);
	}

	const normalLink =
		'rounded-full px-4 py-2 text-[#171615] transition hover:bg-[#f2ede7] hover:text-[#c95b39]';

	const activeLink =
		'rounded-full bg-[#c95b39] px-4 py-2 font-bold !text-white transition hover:bg-[#a64326] hover:!text-white';

	const activeButton =
		'rounded-full bg-[#c95b39] px-5 py-3 font-bold !text-white transition hover:-translate-y-0.5 hover:bg-[#a64326] hover:!text-white';

	const normalButton =
	'rounded-full px-5 py-3 font-bold text-[#171615] transition hover:-translate-y-0.5 hover:bg-[#f2ede7] hover:text-[#c95b39]';
</script>

<svelte:head>
	<title>PixelPost</title>
</svelte:head>

<header class="sticky top-0 z-20 border-b border-[#e9e2d9] bg-[#fbf9f6]/95 backdrop-blur-xl">
	<nav
		class="mx-auto flex min-h-[70px] w-[min(1120px,calc(100%-32px))] items-center justify-between gap-6 max-[800px]:flex-col max-[800px]:items-start max-[800px]:py-4"
	>
		<a
			class="font-serif text-[1.6rem] font-bold tracking-[-0.06rem] text-[#171615] transition hover:text-[#c95b39]"
			href="/"
		>
			PixelPost
		</a>

		<div
			class="flex items-center gap-3 text-[0.95rem] text-[#171615] max-[800px]:flex-wrap max-[800px]:gap-x-3 max-[800px]:gap-y-3"
		>
			<a class={isActive('/') ? activeLink : normalLink} href="/">Explore</a>

			{#if data.user}
				<a
					class={startsWith(`/profile/${data.user.id}`) ? activeLink : normalLink}
					href="/profile/{data.user.id}"
				>
					My Profile
				</a>

				<a
					class={isActive('/private/upload') ? activeButton : normalButton}
					href="/private/upload"
				>
					Upload
				</a>

				<a
					class={isActive('/private/images') ? activeLink : normalLink}
					href="/private/images"
				>
					Manage
				</a>

				{#if data.user.role === 'admin'}
					<a
						class={startsWith('/private/admin') ? activeLink : normalLink}
						href="/private/admin"
					>
						Admin
					</a>
				{/if}

				<form class="m-0" action="/logout?/logout" method="POST">
					<button
						class="cursor-pointer rounded-full border-0 bg-transparent px-4 py-2 text-[0.95rem] text-[#171615] transition hover:bg-[#f2ede7] hover:text-[#c95b39]"
						type="submit"
					>
						Logout
					</button>
				</form>
			{:else}
				<a class={isActive('/login') ? activeLink : normalLink} href="/login">Login</a>

				<a
					class={isActive('/register') ? activeButton : normalButton}
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