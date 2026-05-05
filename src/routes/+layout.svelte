<script lang="ts">
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { auth, lock, unlock } from '$lib/stores/auth';
  import { cards } from '$lib/stores/cards';
  import { initTheme } from '$lib/stores/theme';
  import { isAvailable, authenticate } from '$lib/services/webauthn';
  import { getItem, setItem } from '$lib/services/storage';
  import { generateKey, exportKey, importKey, decrypt, encrypt } from '$lib/services/crypto';
  import LockScreen from '$lib/components/LockScreen.svelte';
  import TabBar from '$lib/components/TabBar.svelte';
  import '../app.css';

  let { children } = $props();
  let pinFallback = $state(false);
  let pinInput = $state('');
  let pinError = $state('');

  $effect(() => {
    if (browser) {
      initTheme();
      checkAuth();
      document.addEventListener('visibilitychange', handleVisibility);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${base}/sw.js`);
      }
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }
  });

  function handleVisibility() {
    if (document.hidden) lock();
  }

  async function checkAuth() {
    const available = await isAvailable();
    auth.webauthnAvailable = available;
    const credId = localStorage.getItem('bankapp_credential');
    auth.registered = !!credId;
  }

  async function handleUnlock() {
    try {
      const success = await authenticate();
      if (success) {
        await loadCards();
        unlock();
      }
    } catch (e) {
      console.error('Auth failed', e);
    }
  }

  async function handlePinUnlock() {
    const storedHash = localStorage.getItem('bankapp_pin_hash');
    if (!storedHash) {
      localStorage.setItem('bankapp_pin_hash', pinInput);
      await loadCards();
      unlock();
    } else if (pinInput === storedHash) {
      await loadCards();
      unlock();
    } else {
      pinError = 'Incorrect PIN';
    }
  }

  async function loadCards() {
    try {
      const keyData = await getItem('cryptoKey');
      if (!keyData) {
        const key = await generateKey();
        await setItem('cryptoKey', await exportKey(key));
        cards.list = [];
        return;
      }
      const key = await importKey(keyData as string);
      const encrypted = await getItem('cards') as {iv: string, ciphertext: string} | null;
      if (encrypted) {
        const json = await decrypt(key, encrypted.iv, encrypted.ciphertext);
        cards.list = JSON.parse(json);
      } else {
        cards.list = [];
      }
    } catch (e) {
      console.error('Failed to load cards', e);
      cards.list = [];
    }
  }
</script>

{#if !auth.unlocked}
  <LockScreen
    onfaceId={handleUnlock}
    onPinFallback={() => pinFallback = true}
    showFallback={!auth.webauthnAvailable || pinFallback}
  />
  {#if pinFallback || !auth.webauthnAvailable}
    <div class="pin-entry">
      <input type="password" inputmode="numeric" maxlength="4" placeholder="Enter PIN" bind:value={pinInput} />
      {#if pinError}<p class="error">{pinError}</p>{/if}
      <button class="btn-primary" onclick={handlePinUnlock}>Unlock</button>
    </div>
  {/if}
{:else}
  <main class="app-content">
    {@render children()}
  </main>
  <TabBar />
{/if}

<style>
  .pin-entry {
    position: fixed;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    z-index: 1001;
  }

  .pin-entry input {
    width: 160px;
    text-align: center;
    font-size: 24px;
    letter-spacing: 8px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--separator);
    background: var(--surface);
    color: var(--text);
  }

  .pin-entry .error {
    color: var(--destructive, #ff3b30);
    font-size: 14px;
  }

  .app-content {
    padding-bottom: calc(90px + env(safe-area-inset-bottom));
    padding-top: env(safe-area-inset-top);
  }
</style>
