import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EmptyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          This is the empty mode. Start a new conversation to begin.
        </p>
        <Button className="mt-6">
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
}
