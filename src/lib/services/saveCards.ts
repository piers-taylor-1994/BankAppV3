import { cards } from '$lib/stores/cards.svelte';
import { getItem, setItem } from '$lib/services/storage';
import { importKey, encrypt } from '$lib/services/crypto';

export async function saveCards() {
  const keyData = await getItem('cryptoKey');
  if (!keyData) return;
  const key = await importKey(keyData as string);
  const encrypted = await encrypt(key, JSON.stringify(cards.list));
  await setItem('cards', encrypted);
}
