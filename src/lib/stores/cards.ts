export interface Card {
	id: string;
	bank: string;
	cardType: 'debit' | 'credit';
	cvv: string;
	pin: string;
}

let _cards = $state<Card[]>([]);

export const cards = {
	get list() {
		return _cards;
	},
	set list(v: Card[]) {
		_cards = v;
	},
	add(card: Card) {
		_cards = [..._cards, card];
	},
	update(card: Card) {
		_cards = _cards.map((c) => (c.id === card.id ? card : c));
	},
	remove(id: string) {
		_cards = _cards.filter((c) => c.id !== id);
	},
	clear() {
		_cards = [];
	}
};
