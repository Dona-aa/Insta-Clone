<script>
	let { form } = $props();
</script>

<section class="upload-page">
	<div class="form-card upload-card">
		<p class="eyebrow">New post</p>
		<h1>Upload a picture</h1>

		{#if form?.error}
			<p class="alert">{form.error}</p>
		{/if}

		<form class="stack-form" action="?/upload" method="POST" enctype="multipart/form-data">
			<label for="image">Select image</label>
			<input id="image" name="image" type="file" accept="image/*" required />

			<label for="description">Description</label>
			<textarea id="description" name="description" rows="4" maxlength="200" required>{form?.description ?? ''}</textarea>

			<button class="button" type="submit">Upload picture</button>
		</form>
	</div>
</section>