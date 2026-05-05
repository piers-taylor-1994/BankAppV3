const CREDENTIAL_KEY = 'bankapp_credential_id';

export function isAvailable(): boolean {
	return (
		typeof window !== 'undefined' &&
		!!window.PublicKeyCredential &&
		!!navigator.credentials
	);
}

export async function register(username: string): Promise<boolean> {
	try {
		const challenge = crypto.getRandomValues(new Uint8Array(32));
		const credential = (await navigator.credentials.create({
			publicKey: {
				challenge,
				rp: { name: 'BankApp', id: window.location.hostname },
				user: {
					id: new TextEncoder().encode(username),
					name: username,
					displayName: username
				},
				pubKeyCredParams: [
					{ alg: -7, type: 'public-key' },
					{ alg: -257, type: 'public-key' }
				],
				authenticatorSelection: {
					authenticatorAttachment: 'platform',
					residentKey: 'required',
					userVerification: 'required'
				},
				timeout: 60000
			}
		})) as PublicKeyCredential | null;

		if (!credential) return false;

		const credentialId = btoa(
			String.fromCharCode(...new Uint8Array(credential.rawId))
		);
		localStorage.setItem(CREDENTIAL_KEY, credentialId);
		return true;
	} catch {
		return false;
	}
}

export async function authenticate(): Promise<boolean> {
	try {
		const stored = localStorage.getItem(CREDENTIAL_KEY);
		if (!stored) return false;

		const credentialId = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
		const challenge = crypto.getRandomValues(new Uint8Array(32));

		const assertion = await navigator.credentials.get({
			publicKey: {
				challenge,
				rpId: window.location.hostname,
				allowCredentials: [{ id: credentialId, type: 'public-key' }],
				userVerification: 'required',
				timeout: 60000
			}
		});

		return !!assertion;
	} catch {
		return false;
	}
}
