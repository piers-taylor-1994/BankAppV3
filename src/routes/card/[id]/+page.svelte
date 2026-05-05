<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { cards } from '$lib/stores/cards.svelte';
  import { saveCards } from '$lib/services/saveCards';
  import type { Card } from '$lib/stores/cards.svelte';

  let showCvv = $state(false);
  let showPin = $state(false);
  let editing = $state(false);
  let confirmDelete = $state(false);

  let editBank = $state('');
  let editCardType = $state<'debit' | 'credit'>('debit');
  let editCvv = $state('');
  let editPin = $state('');

  let card = $derived(cards.list.find(c => c.id === page.params.id));

  function startEdit() {
    if (!card) return;
    editBank = card.bank;
    editCardType = card.cardType;
    editCvv = card.cvv;
    editPin = card.pin;
    editing = true;
  }

  async function handleSave() {
    if (!card) return;
    cards.update({ id: card.id, bank: editBank, cardType: editCardType, cvv: editCvv, pin: editPin });
    await saveCards();
    editing = false;
  }

  async function handleDelete() {
    if (!card) return;
    cards.remove(card.id);
    await saveCards();
    goto(`${base}/`);
  }
</script>

<div class="page">
  {#if !card}
    <p>Card not found</p>
  {:else if editing}
    <h1>Edit Card</h1>
    <div class="form">
      <label>
        Bank
        <input type="text" bind:value={editBank} />
      </label>
      <label>
        Type
        <select bind:value={editCardType}>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </label>
      <label>
        CVV
        <input type="text" inputmode="numeric" maxlength="4" bind:value={editCvv} />
      </label>
      <label>
        PIN
        <input type="text" inputmode="numeric" maxlength="6" bind:value={editPin} />
      </label>
      <div class="actions">
        <button class="btn btn-accent" onclick={handleSave}>Save</button>
        <button class="btn btn-text" onclick={() => editing = false}>Cancel</button>
      </div>
    </div>
  {:else}
    <h1>{card.bank}</h1>
    <div class="detail-card">
      <div class="detail-row">
        <span class="label">Type</span>
        <span class="value">{card.cardType}</span>
      </div>
      <div class="detail-row">
        <span class="label">CVV</span>
        <button class="value secret" onclick={() => showCvv = !showCvv}>
          {showCvv ? card.cvv : '•••'}
        </button>
      </div>
      <div class="detail-row">
        <span class="label">PIN</span>
        <button class="value secret" onclick={() => showPin = !showPin}>
          {showPin ? card.pin : '••••'}
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-accent" onclick={startEdit}>Edit</button>
      <button class="btn btn-destructive" onclick={() => confirmDelete = true}>Delete</button>
    </div>

    {#if confirmDelete}
      <div class="confirm-overlay" role="dialog">
        <div class="confirm-box">
          <p>Delete this card?</p>
          <div class="confirm-actions">
            <button class="btn btn-destructive" onclick={handleDelete}>Delete</button>
            <button class="btn btn-text" onclick={() => confirmDelete = false}>Cancel</button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
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

  .detail-card {
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 0.5px solid var(--separator);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .label {
    color: var(--text-secondary);
  }

  .value {
    font-weight: 500;
    text-transform: capitalize;
  }

  .secret {
    background: none;
    border: none;
    color: var(--text);
    font-size: 17px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .secret:active {
    background: var(--bg);
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

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .confirm-box {
    background: var(--surface);
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    min-width: 260px;
  }

  .confirm-box p {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
</style>
