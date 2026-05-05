import { browser } from '$app/environment';

let _unlocked = $state(false);
let _registered = $state(false);
let _webauthnAvailable = $state(false);

export const auth = {
	get unlocked() {
		return _unlocked;
	},
	set unlocked(v: boolean) {
		_unlocked = v;
	},
	get registered() {
		return _registered;
	},
	set registered(v: boolean) {
		_registered = v;
	},
	get webauthnAvailable() {
		return _webauthnAvailable;
	},
	set webauthnAvailable(v: boolean) {
		_webauthnAvailable = v;
	}
};

export function lock() {
	_unlocked = false;
}

export function unlock() {
	_unlocked = true;
}
