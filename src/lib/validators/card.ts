export interface ValidationErrors {
	bank?: string;
	cvv?: string;
	pin?: string;
}

export function validateCard(bank: string, cvv: string, pin: string): ValidationErrors {
	const errors: ValidationErrors = {};
	if (!bank.trim()) errors.bank = 'Bank name is required';
	if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'CVV must be 3 or 4 digits';
	if (!/^\d{4}$/.test(pin)) errors.pin = 'PIN must be 4 digits';
	return errors;
}

export function isValid(errors: ValidationErrors): boolean {
	return Object.keys(errors).length === 0;
}
