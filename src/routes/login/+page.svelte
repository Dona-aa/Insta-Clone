<script>
  let { form } = $props();
</script>

<h1 class="text-3xl font-bold text-center mt-10">Login</h1>

<form method="post" class="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
  <input name="email" type="email" placeholder="Email" class="w-full border p-2 mb-3 rounded" required>

  <input name="password" type="password" placeholder="Password" class="w-full border p-2 mb-3 rounded" required>

  <button class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
    Login
  </button>

  {#if form?.error}
    <p class="text-red-600 mt-3">{form.error}</p>
  {/if}
</form>