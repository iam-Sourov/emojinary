'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronUp, User2 } from 'lucide-react';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

function AppSidebarContent() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between w-full">
          {isCollapsed ? (
            /* Collapsed state: Show icon + toggle button */
            <div className="flex items-center justify-center w-full">
              <SidebarTrigger />
            </div>
          ) : (
            /* Expanded state: Show full layout */
            <>
              {/* Left side: Logo and Theme Toggler */}
              <div className="flex items-center min-w-0 flex-1">
                <div className="text-lg font-bold font-mono uppercase tracking-wider">Emojinary</div>
              </div>

              {/* Right side: Sidebar Trigger */}
              <div className="flex items-center gap-1">
                <AnimatedThemeToggler />
                {/* <SidebarTrigger /> */}
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <AppSidebarContent />
    </Sidebar>
  );
}
