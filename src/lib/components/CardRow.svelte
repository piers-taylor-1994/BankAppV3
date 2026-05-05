<script lang="ts">
  import type { Card } from '$lib/types';

  let { card, onclick } = $props<{
    card: Card;
    onclick: () => void;
  }>();
</script>

<button class="list-row card-row" {onclick}>
  <div class="bank-logo">
    {card.bank.charAt(0).toUpperCase()}
  </div>
  <div class="card-info">
    <span class="bank-name">{card.bank}</span>
    <span class="card-type-badge">{card.cardType}</span>
  </div>
  <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2">
    <path d="M9 18l6-6-6-6"/>
  </svg>
</button>

<style>
  .card-row {
    width: 100%;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 17px;
  }

  .bank-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }

  .card-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bank-name {
    font-weight: 500;
  }

  .card-type-badge {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--bg);
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: capitalize;
  }

  .chevron {
    flex-shrink: 0;
  }
</style>
