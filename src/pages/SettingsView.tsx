import { useState, useEffect } from "react";
import { safeInvoke } from "@/lib/tauri";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { useToast } from "@/hooks/useToast";
import { GreetTest } from "@/components/features/GreetTest";
import { Cloud, Image as ImageIcon, Save, Loader2, Plus } from "lucide-react";

interface ConfigData {
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  cloudinary_api_secret: string;
  r2_access_key_id: string;
  r2_secret_access_key: string;
  r2_bucket_name: string;
  r2_endpoint: string;
  r2_public_domain: string;
  settings_max_width: number;
  settings_auto_webp: boolean;
}

export default function SettingsView() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ConfigData>({
    cloudinary_cloud_name: "",
    cloudinary_api_key: "",
    cloudinary_api_secret: "",
    r2_access_key_id: "",
    r2_secret_access_key: "",
    r2_bucket_name: "",
    r2_endpoint: "",
    r2_public_domain: "",
    settings_max_width: 1600,
    settings_auto_webp: true,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const result = await safeInvoke<ConfigData>("get_config");
      setConfig(result);
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const handleChange = (key: keyof ConfigData, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await safeInvoke("save_config", { config });
      
      toast({
        title: "Settings saved",
        description: "Configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your cloud providers and preferences</p>
      </div>

      {/* IPC Test */}
      <div className="mb-6">
        <GreetTest />
      </div>

      {/* Cloud Providers Tabs */}
      <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <Tabs defaultValue="cloudinary" className="w-full">
          <div className="border-b border-border/50 px-6 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Cloud className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cloud Providers</h3>
                  <p className="text-xs text-muted-foreground">Configure your storage providers</p>
                </div>
              </div>
              {/* Future: Add provider button */}
              {/* <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button> */}
            </div>
            
            <TabsList className="bg-transparent h-auto p-0 gap-2">
              <TabsTrigger 
                value="cloudinary"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Cloudinary
              </TabsTrigger>
              <TabsTrigger 
                value="r2"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Cloud className="h-4 w-4 mr-2" />
                Cloudflare R2
              </TabsTrigger>
              {/* Future: Easy to add more providers */}
              {/* <TabsTrigger value="s3">
                <Cloud className="h-4 w-4 mr-2" />
                AWS S3
              </TabsTrigger>
              <TabsTrigger value="gcs">
                <Cloud className="h-4 w-4 mr-2" />
                Google Cloud
              </TabsTrigger> */}
            </TabsList>
          </div>

          {/* Cloudinary Content */}
          <TabsContent value="cloudinary" className="p-6 m-0">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cloudinary_cloud_name">Cloud Name</Label>
                <Input
                  id="cloudinary_cloud_name"
                  value={config.cloudinary_cloud_name}
                  onChange={(e) => handleChange("cloudinary_cloud_name", e.target.value)}
                  placeholder="your-cloud-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cloudinary_api_key">API Key</Label>
                <Input
                  id="cloudinary_api_key"
                  value={config.cloudinary_api_key}
                  onChange={(e) => handleChange("cloudinary_api_key", e.target.value)}
                  placeholder="123456789012345"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cloudinary_api_secret">API Secret</Label>
                <Input
                  id="cloudinary_api_secret"
                  type="password"
                  value={config.cloudinary_api_secret}
                  onChange={(e) => handleChange("cloudinary_api_secret", e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>
          </TabsContent>

          {/* Cloudflare R2 Content */}
          <TabsContent value="r2" className="p-6 m-0">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="r2_access_key_id">Access Key ID</Label>
                <Input
                  id="r2_access_key_id"
                  value={config.r2_access_key_id}
                  onChange={(e) => handleChange("r2_access_key_id", e.target.value)}
                  placeholder="your-access-key-id"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r2_secret_access_key">Secret Access Key</Label>
                <Input
                  id="r2_secret_access_key"
                  type="password"
                  value={config.r2_secret_access_key}
                  onChange={(e) => handleChange("r2_secret_access_key", e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r2_bucket_name">Bucket Name</Label>
                <Input
                  id="r2_bucket_name"
                  value={config.r2_bucket_name}
                  onChange={(e) => handleChange("r2_bucket_name", e.target.value)}
                  placeholder="my-bucket"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r2_endpoint">Endpoint</Label>
                <Input
                  id="r2_endpoint"
                  value={config.r2_endpoint}
                  onChange={(e) => handleChange("r2_endpoint", e.target.value)}
                  placeholder="https://xxxxx.r2.cloudflarestorage.com"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="r2_public_domain">Public Domain</Label>
                <Input
                  id="r2_public_domain"
                  value={config.r2_public_domain}
                  onChange={(e) => handleChange("r2_public_domain", e.target.value)}
                  placeholder="https://cdn.example.com"
                />
              </div>
            </div>
          </TabsContent>

          {/* Future: Easy to add more provider tabs */}
          {/* <TabsContent value="s3" className="p-6 m-0">
            <div className="grid md:grid-cols-2 gap-4">
              ... S3 fields ...
            </div>
          </TabsContent> */}
        </Tabs>
      </div>

      {/* Processing Settings */}
      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Processing Settings</h3>
            <p className="text-sm text-muted-foreground">Configure image processing options</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="settings_max_width">Max Width (px)</Label>
            <Input
              id="settings_max_width"
              type="number"
              value={config.settings_max_width}
              onChange={(e) => handleChange("settings_max_width", parseInt(e.target.value))}
              min="100"
              max="4000"
            />
            <p className="text-xs text-muted-foreground">Images wider than this will be resized</p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-muted/30">
            <input
              id="settings_auto_webp"
              type="checkbox"
              checked={config.settings_auto_webp}
              onChange={(e) => handleChange("settings_auto_webp", e.target.checked)}
              className="w-4 h-4 text-primary rounded mt-1"
            />
            <Label htmlFor="settings_auto_webp" className="cursor-pointer flex-1">
              <span className="font-medium block mb-1">Auto convert to WebP</span>
              <p className="text-xs text-muted-foreground">Automatically convert images to WebP format for better compression</p>
            </Label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/50 p-4 -mx-8 -mb-8 mt-6">
        <Button 
          onClick={handleSave} 
          className="w-full h-11 text-base font-medium"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

