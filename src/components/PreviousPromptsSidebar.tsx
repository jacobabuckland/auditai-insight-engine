
import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type PreviousPrompt = {
  id: string;
  text: string;
  createdAt: Date;
};

interface PreviousPromptsSidebarProps {
  prompts: PreviousPrompt[];
  onPromptSelect: (promptText: string) => void;
}

export const PreviousPromptsSidebar = ({ 
  prompts, 
  onPromptSelect 
}: PreviousPromptsSidebarProps) => {
  return (
    <Sidebar variant="sidebar" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Previous Prompts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {prompts.length === 0 ? (
                <div className="text-sm text-muted-foreground p-3">
                  No previous prompts yet
                </div>
              ) : (
                prompts.map((prompt) => (
                  <SidebarMenuItem key={prompt.id}>
                    <SidebarMenuButton
                      onClick={() => onPromptSelect(prompt.text)}
                      className="flex items-start"
                    >
                      <Clock className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex flex-col ml-2 overflow-hidden">
                        <span className="truncate text-sm">{prompt.text}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(prompt.createdAt)}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
