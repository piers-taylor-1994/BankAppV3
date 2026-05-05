<script lang="ts">
  let {
    initialBank = '',
    initialCardType = 'debit',
    initialCvv = '',
    initialPin = '',
    onsubmit,
    submitLabel = 'Save',
  } = $props<{
    initialBank?: string;
    initialCardType?: 'debit' | 'credit';
    initialCvv?: string;
    initialPin?: string;
    onsubmit: (data: { bank: string; cardType: 'debit' | 'credit'; cvv: string; pin: string }) => void;
    submitLabel?: string;
  }>();

  let bank = $state(initialBank);
  let cardType = $state<'debit' | 'credit'>(initialCardType);
  let cvv = $state(initialCvv);
  let pin = $state(initialPin);
  let errors = $state<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!bank.trim()) e.bank = 'Bank name is required';
    if (!cvv || cvv.length < 3) e.cvv = 'CVV must be 3-4 digits';
    if (!pin || pin.length < 4) e.pin = 'PIN must be 4 digits';
    errors = e;
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      onsubmit({ bank: bank.trim(), cardType, cvv, pin });
    }
  }
</script>

<form class="card-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <div class="form-section">
    <label class="section-header">Bank</label>
    <div class="card-group">
      <div class="field">
        <input
          class="input"
          class:input-error={errors.bank}
          type="text"
          placeholder="e.g. Monzo"
          bind:value={bank}
        />
        {#if errors.bank}<span class="error-text">{errors.bank}</span>{/if}
      </div>
    </div>
  </div>

  <div class="form-section">
    <label class="section-header">Card Type</label>
    <div class="card-group">
      <div class="field">
        <div class="segmented-control">
          <button type="button" class:active={cardType === 'debit'} onclick={() => cardType = 'debit'}>Debit</button>
          <button type="button" class:active={cardType === 'credit'} onclick={() => cardType = 'credit'}>Credit</button>
        </div>
      </div>
    </div>
  </div>

  <div class="form-section">
    <label class="section-header">CVV</label>
    <div class="card-group">
      <div class="field">
        <input
          class="input"
          class:input-error={errors.cvv}
          type="text"
          inputmode="numeric"
          maxlength="4"
          placeholder="•••"
          bind:value={cvv}
        />
        {#if errors.cvv}<span class="error-text">{errors.cvv}</span>{/if}
      </div>
    </div>
  </div>

  <div class="form-section">
    <label class="section-header">PIN</label>
    <div class="card-group">
      <div class="field">
        <input
          class="input"
          class:input-error={errors.pin}
          type="text"
          inputmode="numeric"
          maxlength="4"
          placeholder="••••"
          bind:value={pin}
        />
        {#if errors.pin}<span class="error-text">{errors.pin}</span>{/if}
      </div>
    </div>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-accent">{submitLabel}</button>
  </div>
</form>

<style>
  .card-form {
    padding: 16px 0;
  }

  .form-section {
    margin-bottom: 24px;
  }

  .field {
    padding: 8px 16px;
  }

  .form-actions {
    padding: 16px;
  }
</style>
