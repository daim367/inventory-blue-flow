import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { toast } from "sonner";

export const InstallButton = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();

  const handleInstall = async () => {
    const wasInstalled = await promptInstall();
    if (wasInstalled) {
      toast.success("App installed successfully!");
    } else {
      toast.error("Installation was cancelled");
    }
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <Button 
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
};