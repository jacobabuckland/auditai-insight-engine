
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suggestion } from "@/services/auditService";
import { 
  ViewIcon, 
  SlidersHorizontalIcon, 
  CheckIcon, 
  MaximizeIcon, 
  PencilIcon, 
  EyeIcon,
  ToggleLeft,
  ToggleRight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";

interface PreviewPanelProps {
  originalHtml: string;
  acceptedSuggestions: Suggestion[];
  modifiedHtml: string;
}

const PreviewPanel = ({ originalHtml, acceptedSuggestions, modifiedHtml }: PreviewPanelProps) => {
  const [viewMode, setViewMode] = useState<"split" | "full">("split");
  const [showingOriginal, setShowingOriginal] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<"preview" | "edit">("preview");
  const [editableHtml, setEditableHtml] = useState<string>(modifiedHtml);
  const [savedHtml, setSavedHtml] = useState<string>(modifiedHtml);
  const editableRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Update editable HTML when modifiedHtml changes
  useEffect(() => {
    setEditableHtml(modifiedHtml);
    setSavedHtml(modifiedHtml);
  }, [modifiedHtml]);

  if (!originalHtml) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">No preview available. Crawl a page to see content.</p>
      </div>
    );
  }

  const toggleView = () => {
    setViewMode(viewMode === "split" ? "full" : "split");
  };

  const handleSaveChanges = () => {
    if (displayMode === "edit" && editableRef.current) {
      const newHtml = editableRef.current.innerHTML;
      setSavedHtml(newHtml);
      
      toast({
        title: "Changes saved",
        description: "Your edited content has been saved",
        duration: 3000,
      });
      
      // Optionally switch back to preview mode
      setDisplayMode("preview");
    } else {
      // This would save or apply changes in a real application
      console.log("Changes saved:", acceptedSuggestions);
    }
  };

  const renderModifiedContent = () => {
    if (displayMode === "edit") {
      return (
        <div 
          ref={editableRef}
          contentEditable={true}
          className="p-4 w-full h-full min-h-[400px] border border-blue-200 rounded bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          dangerouslySetInnerHTML={{ __html: editableHtml }}
        />
      );
    } else {
      return (
        <iframe
          srcDoc={showingOriginal ? originalHtml : savedHtml}
          className="w-full h-[420px] border-0"
          title={showingOriginal ? "Original Page" : "Modified Page"}
          sandbox="allow-same-origin"
        ></iframe>
      );
    }
  };

  return (
    <div className="mt-8 border rounded-lg bg-white shadow-sm">
      <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 gap-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {viewMode === "full" && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Original</span>
              <Switch 
                id="version-toggle"
                checked={!showingOriginal}
                onCheckedChange={() => setShowingOriginal(!showingOriginal)}
              />
              <span className="text-sm text-gray-600">Modified</span>
            </div>
          )}
          
          <ToggleGroup type="single" value={displayMode} onValueChange={(value) => value && setDisplayMode(value as "preview" | "edit")}>
            <ToggleGroupItem value="preview" aria-label="Preview AI Suggestions">
              <EyeIcon size={16} className="mr-1" />
              Preview
            </ToggleGroupItem>
            <ToggleGroupItem value="edit" aria-label="Edit AI Suggestions">
              <PencilIcon size={16} className="mr-1" />
              Edit
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Button variant="outline" size="sm" onClick={toggleView}>
            {viewMode === "split" ? (
              <>
                <MaximizeIcon size={16} className="mr-1" />
                Full View
              </>
            ) : (
              <>
                <SlidersHorizontalIcon size={16} className="mr-1" />
                Split View
              </>
            )}
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveChanges}>
            <CheckIcon size={16} className="mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className={`${viewMode === "split" ? "flex flex-col md:flex-row" : "block"} p-4 h-[500px]`}>
        {(viewMode === "split" || (viewMode === "full" && showingOriginal)) && (
          <div
            className={`${
              viewMode === "split" ? "w-full md:w-1/2 md:pr-2 md:border-r mb-4 md:mb-0" : "w-full"
            } h-full overflow-hidden`}
          >
            <div className="mb-2 text-sm font-medium text-gray-700">Original</div>
            <ScrollArea className="h-[450px] border rounded-md bg-gray-50">
              <div className="p-4">
                <iframe
                  srcDoc={originalHtml}
                  className="w-full h-[420px] border-0"
                  title="Original Page"
                  sandbox="allow-same-origin"
                ></iframe>
              </div>
            </ScrollArea>
          </div>
        )}

        {(viewMode === "split" || (viewMode === "full" && !showingOriginal)) && (
          <div
            className={`${
              viewMode === "split" ? "w-full md:w-1/2 md:pl-2" : "w-full"
            } h-full overflow-hidden`}
          >
            <div className="mb-2 text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>
                Modified
                {acceptedSuggestions.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                    {acceptedSuggestions.length} change{acceptedSuggestions.length > 1 ? "s" : ""}
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {displayMode === "edit" ? "Edit mode: Make changes directly" : "Preview mode"}
              </span>
            </div>
            <ScrollArea className="h-[450px] border rounded-md bg-gray-50">
              <div className="p-4">
                {renderModifiedContent()}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
