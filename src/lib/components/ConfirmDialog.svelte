<script lang="ts">
  let {
    title,
    message,
    confirmLabel = 'Confirm',
    destructive = false,
    onconfirm,
    oncancel,
  } = $props<{
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
    onconfirm: () => void;
    oncancel: () => void;
  }>();
</script>

<div class="overlay" onclick={oncancel}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="dialog" role="alertdialog" onclick={(e) => e.stopPropagation()}>
    <div class="dialog-content">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
    <div class="dialog-actions">
      <button class="dialog-btn cancel" onclick={oncancel}>Cancel</button>
      <button
        class="dialog-btn confirm"
        class:destructive
        onclick={onconfirm}
      >
        {confirmLabel}
      </button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 32px;
  }

  .dialog {
    background: var(--surface);
    border-radius: 14px;
    width: 100%;
    max-width: 270px;
    overflow: hidden;
    text-align: center;
  }

  .dialog-content {
    padding: 20px 16px 16px;
  }

  h2 {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .dialog-actions {
    display: flex;
    border-top: 0.5px solid var(--separator);
  }

  .dialog-btn {
    flex: 1;
    padding: 12px;
    border: none;
    background: none;
    font-size: 17px;
    cursor: pointer;
    color: var(--accent);
  }

  .dialog-btn + .dialog-btn {
    border-left: 0.5px solid var(--separator);
  }

  .cancel {
    font-weight: 400;
  }

  .confirm {
    font-weight: 600;
  }

  .confirm.destructive {
    color: var(--destructive);
  }
</style>
