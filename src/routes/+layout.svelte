<script lang="ts">
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { auth, lock, unlock } from '$lib/stores/auth.svelte';
  import { cards } from '$lib/stores/cards.svelte';
  import { initTheme } from '$lib/stores/theme.svelte';
  import { isAvailable, authenticate, register } from '$lib/services/webauthn';
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
    const available = isAvailable();
    auth.webauthnAvailable = available;
    const credId = localStorage.getItem('bankapp_credential_id');
    auth.registered = !!credId;
    const hasPin = !!localStorage.getItem('bankapp_pin_hash');
    // First use: no auth set up yet, go straight in
    if (!credId && !hasPin) {
      await loadCards();
      unlock();
    }
  }

  async function handleUnlock() {
    try {
      if (!auth.registered) {
        // First time with biometrics: register a passkey
        const success = await register('user');
        if (success) {
          auth.registered = true;
          await loadCards();
          unlock();
        } else {
          pinFallback = true;
        }
      } else {
        const success = await authenticate();
        if (success) {
          await loadCards();
          unlock();
        } else {
          pinFallback = true;
        }
      }
    } catch (e) {
      console.error('Auth failed', e);
      pinFallback = true;
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
    showFallback={true}
  />
  {#if pinFallback}
    <div class="pin-entry">
      <input type="password" inputmode="numeric" maxlength="4" placeholder="Enter 4-digit PIN" bind:value={pinInput} />
      {#if pinError}<p class="error">{pinError}</p>{/if}
      <button class="btn btn-accent" onclick={handlePinUnlock}>Unlock</button>
    </div>
  {/if}
{:else}
  <div class="app-shell">
    <main class="app-content">
      {@render children()}
    </main>
    <TabBar />
  </div>
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

  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  .app-content {
    flex: 1;
    padding-top: calc(env(safe-area-inset-top, 0px) + 8px);
    padding-bottom: 60px;
  }
</style>
