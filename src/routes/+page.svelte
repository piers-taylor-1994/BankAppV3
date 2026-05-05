<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { cards } from '$lib/stores/cards';
  import CardRow from '$lib/components/CardRow.svelte';
</script>

<div class="page">
  <h1>Cards</h1>

  {#if cards.list.length === 0}
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
      </svg>
      <p>No cards yet</p>
      <a href="{base}/add" class="btn btn-accent">Add your first card</a>
    </div>
  {:else}
    <div class="card-list">
      {#each cards.list as card (card.id)}
        <CardRow {card} onclick={() => goto(`${base}/card/${card.id}`)} />
      {/each}
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

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 80px;
    text-align: center;
  }

  .empty-state p {
    color: var(--text-secondary);
    font-size: 17px;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-radius: 12px;
    overflow: hidden;
  }
</style>
