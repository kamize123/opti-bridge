import { useState } from "react";
import { safeInvoke } from "@/lib/tauri";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

/**
 * Test component for IPC connection
 * This demonstrates the communication between React frontend and Rust backend
 */
export function GreetTest() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [error, setError] = useState("");

  const handleGreet = async () => {
    try {
      setError("");
      const result = await safeInvoke<string>("greet", { name });
      setGreeting(result);
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-3 bg-card">
      <h3 className="font-semibold">IPC Test: Greet Command</h3>
      <p className="text-sm text-muted-foreground">
        Test the connection between frontend and backend
      </p>
      
      <div className="flex gap-2">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          onKeyPress={(e) => e.key === "Enter" && handleGreet()}
        />
        <Button onClick={handleGreet} disabled={!name}>
          Greet
        </Button>
      </div>

      {greeting && (
        <div className="p-3 bg-muted rounded text-sm">
          <strong>Response:</strong> {greeting}
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

