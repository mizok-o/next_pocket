import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "確認",
  cancelText = "キャンセル",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  const confirmButtonStyles =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <dialog
      ref={dialogRef}
      className="p-0 rounded-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      <div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              variant === "danger" ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            {variant === "danger" ? (
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="警告アイコン"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="情報アイコン"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${confirmButtonStyles}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}
