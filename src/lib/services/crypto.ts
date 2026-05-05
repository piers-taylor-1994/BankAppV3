const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

export async function generateKey(): Promise<CryptoKey> {
	return crypto.subtle.generateKey(
		{ name: ALGORITHM, length: KEY_LENGTH },
		true,
		['encrypt', 'decrypt']
	);
}

export async function encrypt(
	key: CryptoKey,
	data: string
): Promise<{ iv: string; ciphertext: string }> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encoded = new TextEncoder().encode(data);
	const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);
	return {
		iv: btoa(String.fromCharCode(...iv)),
		ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
	};
}

export async function decrypt(key: CryptoKey, iv: string, ciphertext: string): Promise<string> {
	const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
	const ctBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
	const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv: ivBytes }, key, ctBytes);
	return new TextDecoder().decode(decrypted);
}

export async function exportKey(key: CryptoKey): Promise<string> {
	const raw = await crypto.subtle.exportKey('raw', key);
	return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

export async function importKey(base64: string): Promise<CryptoKey> {
	const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	return crypto.subtle.importKey('raw', raw, { name: ALGORITHM, length: KEY_LENGTH }, true, [
		'encrypt',
		'decrypt'
	]);
}
