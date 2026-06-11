<script>
	let { form } = $props();
</script>

<section class="auth-page">
	<div class="form-card">
		<p class="eyebrow">New account</p>
		<h1>Join PixelPost</h1>
		<p class="muted">Create an account to upload, comment and upvote pictures.</p>

		{#if form?.error}
			<p class="alert">{form.error}</p>
		{/if}

		<form class="stack-form" action="?/register" method="POST">
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={form?.username ?? ''} required />

			<label for="email">Email</label>
			<input id="email" name="email" type="email" value={form?.email ?? ''} required />

			<label for="password">Password</label>
			<input id="password" name="password" type="password" required />

			<button class="button" type="submit">Create account</button>
		</form>

		<p class="form-switch">Already registered? <a href="/login">Log in</a></p>
	</div>
</section>