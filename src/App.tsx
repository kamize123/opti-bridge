import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { Toaster } from "@/components/common/Toaster";
import UploadView from "@/pages/UploadView";
import HistoryView from "@/pages/HistoryView";
import SettingsView from "@/pages/SettingsView";
import { Upload, History, Settings, Sparkles } from "lucide-react";

function App() {
  return (
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden">
      <Tabs defaultValue="upload" className="flex-1 flex overflow-hidden">
        {/* Modern Sidebar */}
        <div className="w-72 border-r border-border/50 bg-gradient-to-b from-background to-muted/20 flex flex-col shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">OptiBridge</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Image uploader
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 p-3">
            <TabsList className="flex flex-col items-stretch gap-1 bg-transparent h-auto p-0">
              <TabsTrigger 
                value="upload" 
                className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/50"
              >
                <Upload className="h-5 w-5" />
                <span className="font-medium">Upload</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/50"
              >
                <History className="h-5 w-5" />
                <span className="font-medium">History</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="w-full justify-start gap-3 px-4 py-3 h-auto rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/50"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          <TabsContent value="upload" className="flex-1 overflow-auto m-0 p-8 data-[state=active]:animate-in data-[state=active]:fade-in-50">
            <UploadView />
          </TabsContent>
          
          <TabsContent value="history" className="flex-1 overflow-auto m-0 p-8 data-[state=active]:animate-in data-[state=active]:fade-in-50">
            <HistoryView />
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 overflow-auto m-0 p-8 data-[state=active]:animate-in data-[state=active]:fade-in-50">
            <SettingsView />
          </TabsContent>
        </div>
      </Tabs>
      <Toaster />
    </div>
  );
}

export default App;

