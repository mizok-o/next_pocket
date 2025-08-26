import { ErrorIcon } from "@/components/icons";
import { Button, Card } from "@/components/ui";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="max-w-md mx-auto text-center p-8">
    <Card
      variant="elevated"
      className="bg-gradient-to-br from-red-50/80 to-rose-50/60 border border-red-200/60 backdrop-blur-sm shadow-lg shadow-red-500/5"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
        <ErrorIcon className="w-8 h-8 text-white" />
      </div>
      <p className="text-red-500 text-sm mt-2">エラーが発生しました</p>
      <p className="text-red-500 text-sm mt-2">{error}</p>
      <Button
        variant="primary"
        size="lg"
        onClick={onRetry}
        className="mt-4 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
      >
        再試行
      </Button>
    </Card>
  </div>
);
