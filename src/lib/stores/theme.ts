import { browser } from '$app/environment';

export type Theme = 'system' | 'light' | 'dark';
let _theme = $state<Theme>('system');

export const theme = {
	get current() {
		return _theme;
	},
	set current(v: Theme) {
		_theme = v;
		if (browser) {
			localStorage.setItem('theme', v);
			applyTheme(v);
		}
	}
};

export function initTheme() {
	if (browser) {
		const saved = localStorage.getItem('theme') as Theme | null;
		if (saved) _theme = saved;
		applyTheme(_theme);
	}
}

function applyTheme(t: Theme) {
	const root = document.documentElement;
	root.removeAttribute('data-theme');
	if (t !== 'system') root.setAttribute('data-theme', t);
}
