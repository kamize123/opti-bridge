import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import { useToast } from "@/hooks/useToast";
import { GreetTest } from "@/components/features/GreetTest";

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
      const result = await invoke<ConfigData>("get_config");
      setConfig(result);
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const handleSave = async () => {
    try {
      await invoke("save_config", { config });
      
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
    }
  };

  const handleChange = (key: keyof ConfigData, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl space-y-8">
        <GreetTest />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cloudinary Settings</h2>
          
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

          <div className="space-y-2">
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cloudflare R2 Settings</h2>
          
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

          <div className="space-y-2">
            <Label htmlFor="r2_public_domain">Public Domain</Label>
            <Input
              id="r2_public_domain"
              value={config.r2_public_domain}
              onChange={(e) => handleChange("r2_public_domain", e.target.value)}
              placeholder="https://cdn.example.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Processing Settings</h2>
          
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
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="settings_auto_webp"
              type="checkbox"
              checked={config.settings_auto_webp}
              onChange={(e) => handleChange("settings_auto_webp", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="settings_auto_webp">Auto convert to WebP</Label>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

