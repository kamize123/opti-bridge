import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { Toaster } from "@/components/common/Toaster";
import UploadView from "@/pages/UploadView";
import HistoryView from "@/pages/HistoryView";
import SettingsView from "@/pages/SettingsView";

function App() {
  return (
    <div className="h-screen w-screen bg-background text-foreground">
      <div className="container mx-auto h-full py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">OptiBridge</h1>
          <p className="text-muted-foreground">
            High-performance image uploader for technical bloggers
          </p>
        </div>

        <Tabs defaultValue="upload" className="h-[calc(100%-5rem)]">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="h-[calc(100%-3rem)]">
            <UploadView />
          </TabsContent>
          
          <TabsContent value="history" className="h-[calc(100%-3rem)]">
            <HistoryView />
          </TabsContent>
          
          <TabsContent value="settings" className="h-[calc(100%-3rem)]">
            <SettingsView />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

