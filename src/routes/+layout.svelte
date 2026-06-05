<script>
	import '../app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>PixelPost</title>
</svelte:head>

<header class="site-header">
	<nav class="nav container">
		<a class="logo" href="/">PixelPost</a>

		<div class="nav-links">
			<a href="/">Explore</a>

			{#if data.user}
				<a href="/profile/{data.user.id}">My Profile</a>
				<a class="upload-link" href="/private/upload">Upload</a>
				<a href="/private/images">Manage</a>

				<form action="/logout?/logout" method="POST">
					<button class="text-button" type="submit">Logout</button>
				</form>
			{:else}
				<a href="/login">Login</a>
				<a class="upload-link" href="/register">Register</a>
			{/if}
		</div>
	</nav>
</header>

<main class="page container">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="container footer-content">
		<p class="logo">PixelPost</p>
		<p>Share pictures. Discover moments.</p>
	</div>
</footer>