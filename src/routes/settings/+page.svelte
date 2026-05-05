<script lang="ts">
  import { theme } from '$lib/stores/theme.svelte';
  import type { Theme } from '$lib/stores/theme.svelte';
  import { clearAll } from '$lib/services/storage';
  import { lock } from '$lib/stores/auth.svelte';
  import { cards } from '$lib/stores/cards.svelte';

  let confirmReset = $state(false);
  const themes: Theme[] = ['system', 'light', 'dark'];

  async function handleDeleteAll() {
    await clearAll();
    localStorage.clear();
    cards.clear();
    lock();
  }
</script>

<div class="page">
  <h1>Settings</h1>

  <div class="section">
    <div class="list-row">
      <span>Version</span>
      <span class="secondary">0.0.1</span>
    </div>
  </div>

  <h2>Appearance</h2>
  <div class="section segmented">
    {#each themes as t}
      <button
        class="segment"
        class:active={theme.current === t}
        onclick={() => theme.current = t}
      >
        {t.charAt(0).toUpperCase() + t.slice(1)}
      </button>
    {/each}
  </div>

  <h2>Data</h2>
  <div class="section">
    <button class="list-row destructive" onclick={() => confirmReset = true}>
      Delete All Data
    </button>
  </div>

  {#if confirmReset}
    <div class="confirm-overlay" role="dialog">
      <div class="confirm-box">
        <p>Delete all data? This cannot be undone.</p>
        <div class="confirm-actions">
          <button class="btn btn-destructive" onclick={handleDeleteAll}>Delete Everything</button>
          <button class="btn btn-text" onclick={() => confirmReset = false}>Cancel</button>
        </div>
      </div>
    </div>
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

  h2 {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin: 24px 0 8px 16px;
  }

  .section {
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
  }

  .list-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-bottom: 0.5px solid var(--separator);
  }

  .list-row:last-child {
    border-bottom: none;
  }

  .secondary {
    color: var(--text-secondary);
  }

  .destructive {
    color: var(--destructive, #ff3b30);
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 17px;
    text-align: left;
  }

  .segmented {
    display: flex;
    padding: 4px;
    gap: 4px;
  }

  .segment {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .segment.active {
    background: var(--accent);
    color: #fff;
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
