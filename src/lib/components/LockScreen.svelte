<script lang="ts">
  let { onfaceId, onPinFallback, showFallback = false } = $props<{
    onfaceId: () => void;
    onPinFallback: () => void;
    showFallback?: boolean;
  }>();
</script>

<div class="lock-screen">
  <div class="lock-content">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <h1>Card Vault</h1>
    <p>Your cards are securely locked</p>

    <button class="btn btn-accent" onclick={onfaceId}>
      Unlock with Face ID
    </button>

    {#if showFallback}
      <button class="btn btn-text" onclick={onPinFallback}>
        Enter PIN
      </button>
    {/if}
  </div>
</div>

<style>
  .lock-screen {
    position: fixed;
    inset: 0;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .lock-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    text-align: center;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-top: 16px;
  }

  p {
    color: var(--text-secondary);
    font-size: 15px;
    margin-bottom: 24px;
  }

  .btn {
    max-width: 280px;
  }
</style>
