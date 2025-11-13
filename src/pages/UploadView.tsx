import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/state/appStore";
import { useToast } from "@/hooks/useToast";
import { Upload, Clipboard, Copy, Check } from "lucide-react";

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
      const result = await invoke<{
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
      const result = await invoke<{
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
      const result = await invoke<{ url: string }>("upload_image", {
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
      const selected = await open({
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
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-full max-w-2xl p-8 border rounded-lg bg-card">
          <h2 className="text-2xl font-semibold mb-4">Upload Complete</h2>
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Image URL:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadedUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
              />
              <Button onClick={handleCopyUrl} size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={handleReset} className="w-full">
            Upload Another Image
          </Button>
        </div>
      </div>
    );
  }

  if (processedImage) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/20">
          <img
            src={`data:image/webp;base64,${processedImage.previewBase64}`}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Image Details</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Name: {processedImage.originalName}
            </p>
            <p className="text-sm text-muted-foreground">
              {processedImage.sizeInfo}
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Upload Provider</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="cloudinary"
                  checked={selectedProvider === "cloudinary"}
                  onChange={(e) => setSelectedProvider(e.target.value as "cloudinary")}
                  className="w-4 h-4"
                />
                <span>Cloudinary</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="r2"
                  checked={selectedProvider === "r2"}
                  onChange={(e) => setSelectedProvider(e.target.value as "r2")}
                  className="w-4 h-4"
                />
                <span>Cloudflare R2</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload to Cloud"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl p-12 border-2 border-dashed rounded-lg transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-muted/20"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4 text-center">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? "Drop image here" : "Drag & drop an image"}
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, JPEG, WebP, or GIF
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleFileDialog} disabled={isProcessing}>
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
        <Button
          onClick={handleProcessClipboard}
          disabled={isProcessing}
          variant="outline"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          Paste from Clipboard
        </Button>
      </div>

      {isProcessing && (
        <p className="text-sm text-muted-foreground">Processing image...</p>
      )}
    </div>
  );
}

