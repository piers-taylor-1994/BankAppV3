<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { base } from '$app/paths';

  const tabs = [
    { path: `${base}/`, label: 'Cards', icon: 'cards' },
    { path: `${base}/add`, label: 'Add', icon: 'add' },
    { path: `${base}/settings`, label: 'Settings', icon: 'settings' },
  ];

  function isActive(tabPath: string): boolean {
    if (tabPath === `${base}/`) return page.url.pathname === `${base}/` || page.url.pathname === base;
    return page.url.pathname.startsWith(tabPath);
  }
</script>

<nav class="tab-bar">
  {#each tabs as tab}
    <button
      class="tab-item"
      class:active={isActive(tab.path)}
      onclick={() => goto(tab.path)}
    >
      {#if tab.icon === 'cards'}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="5" width="20" height="14" rx="3"/>
          <path d="M2 10h20"/>
        </svg>
      {:else if tab.icon === 'add'}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      {:else if tab.icon === 'settings'}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      {/if}
      <span>{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .tab-bar {
    position: fixed;
    bottom: -34px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    padding-top: 6px;
    padding-bottom: 34px;
    background: var(--surface);
    border-top: 0.5px solid var(--separator);
    z-index: 100;
  }

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    border: none;
    background: none;
    color: var(--text-secondary);
    font-size: 10px;
    cursor: pointer;
    padding: 4px 16px;
  }

  .tab-item.active {
    color: var(--accent);
  }

  .tab-item span {
    font-weight: 500;
  }
</style>
