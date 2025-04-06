
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suggestion } from "@/services/auditService";
import { ViewIcon, SplitViewHorizontalIcon, CheckIcon, MaximizeIcon } from "lucide-react";

interface PreviewPanelProps {
  originalHtml: string;
  acceptedSuggestions: Suggestion[];
  modifiedHtml: string;
}

const PreviewPanel = ({ originalHtml, acceptedSuggestions, modifiedHtml }: PreviewPanelProps) => {
  const [viewMode, setViewMode] = useState<"split" | "full">("split");
  const [showingOriginal, setShowingOriginal] = useState<boolean>(false);

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
    // This would save or apply changes in a real application
    console.log("Changes saved:", acceptedSuggestions);
  };

  return (
    <div className="mt-8 border rounded-lg bg-white shadow-sm">
      <div className="border-b p-4 flex items-center justify-between bg-gray-50">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="flex gap-2">
          {viewMode === "full" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowingOriginal(!showingOriginal)}
            >
              <ViewIcon size={16} className="mr-1" />
              {showingOriginal ? "Show Modified" : "Show Original"}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={toggleView}>
            {viewMode === "split" ? (
              <>
                <MaximizeIcon size={16} className="mr-1" />
                Full View
              </>
            ) : (
              <>
                <SplitViewHorizontalIcon size={16} className="mr-1" />
                Split View
              </>
            )}
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveChanges}>
            <CheckIcon size={16} className="mr-1" />
            Accept Changes
          </Button>
        </div>
      </div>

      <div className={`${viewMode === "split" ? "flex" : "block"} p-4 h-[500px]`}>
        {(viewMode === "split" || (viewMode === "full" && showingOriginal)) && (
          <div
            className={`${
              viewMode === "split" ? "w-1/2 pr-2 border-r" : "w-full"
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
              viewMode === "split" ? "w-1/2 pl-2" : "w-full"
            } h-full overflow-hidden`}
          >
            <div className="mb-2 text-sm font-medium text-gray-700">
              Modified
              {acceptedSuggestions.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  {acceptedSuggestions.length} change{acceptedSuggestions.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <ScrollArea className="h-[450px] border rounded-md bg-gray-50">
              <div className="p-4">
                <iframe
                  srcDoc={modifiedHtml}
                  className="w-full h-[420px] border-0"
                  title="Modified Page"
                  sandbox="allow-same-origin"
                ></iframe>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
