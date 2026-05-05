<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { cards } from '$lib/stores/cards.svelte';
  import { saveCards } from '$lib/services/saveCards';

  let bank = $state('');
  let cardType = $state<'debit' | 'credit'>('debit');
  let cvv = $state('');
  let pin = $state('');

  async function handleSubmit() {
    if (!bank || !cvv || !pin) return;
    cards.add({
      id: crypto.randomUUID(),
      bank,
      cardType,
      cvv,
      pin
    });
    await saveCards();
    goto(`${base}/`);
  }
</script>

<div class="page">
  <h1>Add Card</h1>

  <div class="form">
    <label>
      Bank
      <input type="text" bind:value={bank} placeholder="e.g. Monzo" />
    </label>
    <label>
      Type
      <select bind:value={cardType}>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
    </label>
    <label>
      CVV
      <input type="text" inputmode="numeric" maxlength="4" bind:value={cvv} placeholder="123" />
    </label>
    <label>
      PIN
      <input type="text" inputmode="numeric" maxlength="6" bind:value={pin} placeholder="1234" />
    </label>

    <button class="btn btn-accent" onclick={handleSubmit}>Save Card</button>
  </div>
</div>

<style>
  .page {
    padding: 16px;
  }

  h1 {
    font-size: 34px;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .form input, .form select {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid var(--separator);
    background: var(--surface);
    color: var(--text);
    font-size: 17px;
  }
</style>
