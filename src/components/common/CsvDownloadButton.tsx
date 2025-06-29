interface CsvDownloadButtonProps {
  data?: unknown[];
  filename?: string;
  headers?: Record<string, string>;
  buttonText?: string;
}

export default function CsvDownloadButton({
  buttonText = "CSVダウンロード",
}: CsvDownloadButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {buttonText}
    </button>
  );
}
