import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/state/appStore";
import { useToast } from "@/hooks/useToast";
import { Copy, Trash2, Check } from "lucide-react";

export default function HistoryView() {
  const { history, setHistory } = useAppStore();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await invoke<any[]>("get_history");
      setHistory(result);
    } catch (error) {
      toast({
        title: "Failed to load history",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, url: string, provider: string) => {
    try {
      await invoke("delete_history_item", { id, url, provider });
      await loadHistory();
      
      toast({
        title: "Deleted",
        description: "Item removed from history",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No upload history yet</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-3">
            {item.thumbnailBase64 && (
              <div className="aspect-video bg-muted rounded overflow-hidden">
                <img
                  src={`data:image/webp;base64,${item.thumbnailBase64}`}
                  alt={item.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <p className="font-medium text-sm truncate">{item.originalName}</p>
              <p className="text-xs text-muted-foreground">
                {item.provider === "cloudinary" ? "Cloudinary" : "Cloudflare R2"}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(item.createdAt * 1000).toLocaleString()}
              </p>
            </div>

            <div className="text-xs break-all bg-muted p-2 rounded">
              {item.url}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleCopy(item.url, item.id)}
              >
                {copiedId === item.id ? (
                  <Check className="mr-1 h-3 w-3" />
                ) : (
                  <Copy className="mr-1 h-3 w-3" />
                )}
                Copy
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item.id, item.url, item.provider)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

