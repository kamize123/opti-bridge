import { useEffect, useState } from "react";
import { safeInvoke } from "@/lib/tauri";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/state/appStore";
import { useToast } from "@/hooks/useToast";
import { Copy, Trash2, Check, Image as ImageIcon, ExternalLink, Calendar } from "lucide-react";

export default function HistoryView() {
  const { history, setHistory } = useAppStore();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await safeInvoke<any[]>("get_history");
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
      await safeInvoke("delete_history_item", { id, url, provider });
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
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-full bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">No upload history yet</h3>
            <p className="text-muted-foreground">Upload your first image to see it here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload History</h2>
        <p className="text-muted-foreground">{history.length} {history.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50 animate-in fade-in-50 slide-in-from-bottom-4"
          >
            {/* Thumbnail */}
            {item.thumbnailBase64 ? (
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted overflow-hidden relative">
                <img
                  src={`data:image/webp;base64,${item.thumbnailBase64}`}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <p className="font-semibold text-sm truncate mb-1">{item.originalName}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {item.provider === "cloudinary" ? "Cloudinary" : "R2"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* URL */}
              <div className="relative">
                <div className="text-xs break-all bg-muted/50 p-2 rounded-lg font-mono text-muted-foreground line-clamp-2">
                  {item.url}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCopy(item.url, item.id)}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(item.url, '_blank')}
                  className="shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id, item.url, item.provider)}
                  className="shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

