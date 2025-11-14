import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { safeInvoke, safeOpen } from "@/lib/tauri";
import { Button } from "@/components/common/Button";
import { Label } from "@/components/common/Label";
import { useAppStore } from "@/state/appStore";
import { useToast } from "@/hooks/useToast";
import { Upload, Clipboard, Copy, Check, Image as ImageIcon, Loader2, Cloud, CloudOff } from "lucide-react";

export default function UploadView() {
  const {
    processedImage,
    uploadedUrl,
    isProcessing,
    isUploading,
    setProcessedImage,
    setUploadedUrl,
    setIsProcessing,
    setIsUploading,
    resetUploadState,
  } = useAppStore();

  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<"cloudinary" | "r2">("cloudinary");
  const [copied, setCopied] = useState(false);

  const handleProcessImage = async (filePath: string, fileName: string) => {
    try {
      setIsProcessing(true);
      const result = await safeInvoke<{
        preview_base64: string;
        size_info: string;
        temp_id: string;
      }>("process_image_from_file", { path: filePath });

      setProcessedImage({
        tempId: result.temp_id,
        previewBase64: result.preview_base64,
        sizeInfo: result.size_info,
        originalName: fileName,
      });
      
      toast({
        title: "Image processed",
        description: "Ready to upload",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessClipboard = async () => {
    try {
      setIsProcessing(true);
      const result = await safeInvoke<{
        preview_base64: string;
        size_info: string;
        temp_id: string;
      }>("process_image_from_clipboard");

      setProcessedImage({
        tempId: result.temp_id,
        previewBase64: result.preview_base64,
        sizeInfo: result.size_info,
        originalName: "clipboard",
      });
      
      toast({
        title: "Image processed",
        description: "Ready to upload",
      });
    } catch (error) {
      toast({
        title: "Processing failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!processedImage) return;

    try {
      setIsUploading(true);
      const result = await safeInvoke<{ url: string }>("upload_image", {
        tempId: processedImage.tempId,
        provider: selectedProvider,
      });

      setUploadedUrl(result.url);
      
      toast({
        title: "Upload successful",
        description: "Image uploaded to cloud",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!uploadedUrl) return;
    
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
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

  const handleFileDialog = async () => {
    try {
      const selected = await safeOpen({
        multiple: false,
        filters: [{
          name: "Image",
          extensions: ["png", "jpg", "jpeg", "webp", "gif"],
        }],
      });

      if (selected && typeof selected === "string") {
        const fileName = selected.split(/[\\/]/).pop() || "unknown";
        await handleProcessImage(selected, fileName);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // @ts-ignore - Tauri provides path property
      const filePath = file.path;
      if (filePath) {
        await handleProcessImage(filePath, file.name);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    multiple: false,
    noClick: true,
  });

  const handleReset = () => {
    resetUploadState();
    setCopied(false);
  };

  if (uploadedUrl) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border/50 rounded-2xl shadow-lg p-8 space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Upload Complete!</h2>
              <p className="text-muted-foreground">Your image has been uploaded successfully</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Image URL</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={uploadedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 text-sm border border-border rounded-lg bg-muted/50 font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button 
                  onClick={handleCopyUrl} 
                  size="icon"
                  className="h-11 w-11 shrink-0"
                >
                  {copied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleReset} 
              className="w-full h-11 text-base font-medium"
              variant="outline"
            >
              Upload Another Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (processedImage) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden animate-in fade-in-50 slide-in-from-left-4 duration-500">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-8">
                <img
                  src={`data:image/webp;base64,${processedImage.previewBase64}`}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Image Details */}
            <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Name</p>
                  <p className="font-medium truncate">{processedImage.originalName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Size</p>
                  <p className="font-medium">{processedImage.sizeInfo}</p>
                </div>
              </div>
            </div>

            {/* Provider Selection */}
            <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Upload Provider
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    value="cloudinary"
                    checked={selectedProvider === "cloudinary"}
                    onChange={(e) => setSelectedProvider(e.target.value as "cloudinary")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="font-medium">Cloudinary</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    value="r2"
                    checked={selectedProvider === "r2"}
                    onChange={(e) => setSelectedProvider(e.target.value as "r2")}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="font-medium">Cloudflare R2</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full h-11 text-base font-medium"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    Upload to Cloud
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-11"
              >
                <CloudOff className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="w-full max-w-4xl space-y-6">
        {/* Modern Dropzone */}
        <div
          {...getRootProps()}
          className={`group relative w-full p-16 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02] shadow-lg"
              : "border-border/50 bg-gradient-to-br from-card to-muted/30 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className={`p-4 rounded-full transition-all duration-300 ${
              isDragActive 
                ? "bg-primary/20 scale-110" 
                : "bg-muted group-hover:bg-primary/10"
            }`}>
              <Upload className={`h-10 w-10 transition-colors duration-300 ${
                isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`} />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-semibold">
                {isDragActive ? "Drop image here" : "Drag & drop an image"}
              </p>
              <p className="text-muted-foreground">
                or choose from your computer
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                Supports PNG, JPG, JPEG, WebP, GIF
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleFileDialog} 
            disabled={isProcessing}
            className="h-12 px-6 text-base font-medium"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Choose File
              </>
            )}
          </Button>
          <Button
            onClick={handleProcessClipboard}
            disabled={isProcessing}
            variant="outline"
            className="h-12 px-6 text-base font-medium"
            size="lg"
          >
            <Clipboard className="mr-2 h-5 w-5" />
            Paste from Clipboard
          </Button>
        </div>
      </div>
    </div>
  );
}

