"use client";

export default function PrintInvoiceButton() {
  return (
    <button
      className="invoice-btn-solid"
      type="button"
      onClick={() => window.print()}
    >
      🖨️ Imprimer
    </button>
  );
}