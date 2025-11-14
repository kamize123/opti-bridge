import { useEffect, useState, useMemo } from "react";
import { safeInvoke } from "@/lib/tauri";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/state/appStore";
import { useToast } from "@/hooks/useToast";
import { Copy, Trash2, Check, Image as ImageIcon, ExternalLink, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function HistoryView() {
  const { history, setHistory } = useAppStore();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
      
      // Reset to first page if current page becomes empty
      const totalPages = Math.ceil((history.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
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

  // Pagination calculations
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHistory = useMemo(() => {
    return history.slice(startIndex, endIndex);
  }, [history, startIndex, endIndex]);

  // Reset to page 1 when history changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [history.length, totalPages, currentPage]);

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
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload History</h2>
        <p className="text-muted-foreground">
          {history.length} {history.length === 1 ? 'item' : 'items'}
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </p>
      </div>

      {/* List View */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border/50">
          {paginatedHistory.map((item) => (
            <div
              key={item.id}
              className="group hover:bg-muted/30 transition-colors duration-150"
            >
              <div className="p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                  {item.thumbnailBase64 ? (
                    <img
                      src={`data:image/webp;base64,${item.thumbnailBase64}`}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate mb-1">
                        {item.originalName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {item.provider === "cloudinary" ? "Cloudinary" : "R2"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt * 1000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* URL */}
                  <div className="text-xs font-mono text-muted-foreground truncate bg-muted/50 px-2 py-1 rounded">
                    {item.url}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="h-9"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(item.url, '_blank')}
                    className="h-9 w-9 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id, item.url, item.provider)}
                    className="h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, history.length)} of {history.length} items
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-9"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-9 w-9 p-0"
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-9"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

