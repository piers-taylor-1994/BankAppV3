export function getBankLogoUrl(bankName: string): string {
	const normalized = bankName.toLowerCase().replace(/\s+/g, '');
	const known = ['amex', 'barclays', 'firstdirect', 'hsbc', 'lloyds', 'natwest', 'virgin'];
	const match = known.find((k) => normalized.includes(k));
	return `/BankAppV3/logos/${match || 'bank'}.png`;
}
