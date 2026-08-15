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
import { ChevronUp, Plus, Trash2, LogIn, BookOpen } from 'lucide-react';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';
import { useConversations } from '@/lib/conversation-context';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

function AppSidebarContent() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const router = useRouter();
  const pathname = usePathname();
  
  const { user, isLoggedIn, logout } = useAuth();
  const { conversations, deleteConversation } = useConversations();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between w-full">
          {isCollapsed ? (
            /* Collapsed state: Show icon + toggle button */
            <div className="flex items-center justify-center w-full py-1">
              <SidebarTrigger />
            </div>
          ) : (
            /* Expanded state: Show full layout */
            <>
              {/* Left side: Logo and Theme Toggler */}
              <div className="flex items-center min-w-0 flex-1">
                <Link href="/" className="text-xl font-heading font-normal px-2 pt-1 pb-2 inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/95 to-primary/80 select-none">
                  Emojinary
                </Link>
              </div>

              {/* Right side: Sidebar Trigger */}
              <div className="flex items-center gap-1.5">
                <AnimatedThemeToggler />
                <SidebarTrigger />
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Core Actions */}
        <SidebarGroup className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/')}
                className="w-full justify-start gap-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent"
                tooltip="New Story"
              >
                <Plus className="h-4 w-4" />
                {!isCollapsed && <span className="font-semibold text-xs">New Story</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Recent Conversations List */}
        {!isCollapsed && conversations.length > 0 && (
          <SidebarGroup className="pt-0">
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
              <BookOpen size={10} />
              Recent Tales
            </h3>
            <SidebarMenu className="max-h-[50vh] overflow-y-auto pr-1">
              {conversations.map((conv) => {
                const isActive = pathname === `/story/${conv.id}`;
                return (
                  <SidebarMenuItem key={conv.id} className="group/item relative">
                    <SidebarMenuButton
                      onClick={() => router.push(`/story/${conv.id}`)}
                      className={`w-full justify-start gap-2 rounded-xl py-5 px-3 transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold border-l-2 border-primary' 
                          : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-base select-none shrink-0" title={conv.emojis.join('')}>
                        {conv.emojis.slice(0, 2).join('')}
                      </span>
                      <span className="truncate text-xs text-left max-w-[140px] font-medium leading-none">
                        {conv.title.replace('Story', '').trim() || 'Untitled'}
                      </span>
                    </SidebarMenuButton>
                    
                    {/* Delete button, visible on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                        if (isActive) {
                          router.push('/');
                        }
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground/45 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 size={12} />
                    </button>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="py-6 px-3 rounded-xl cursor-pointer hover:bg-sidebar-accent">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-xs shrink-0 select-none">
                      {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    {!isCollapsed && (
                      <div className="flex flex-col items-start overflow-hidden ml-2">
                        <span className="text-xs font-semibold truncate max-w-[120px]">
                          {user.name || 'Storyteller'}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {user.email}
                        </span>
                      </div>
                    )}
                    {!isCollapsed && <ChevronUp className="ml-auto shrink-0" size={14} />}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-52 rounded-xl ml-2 mb-1 shadow-lg border-border/40 bg-card">
                  <DropdownMenuItem className="cursor-default text-xs py-2.5 px-3 border-b border-border/25">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">Logged In As</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 text-xs py-2.5 px-3 gap-2"
                  >
                    <LogOutIcon size={14} />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                onClick={() => router.push(`/login?redirect=${pathname}`)}
                className="py-6 px-3 rounded-xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/30 justify-center gap-2"
                tooltip="Sign In"
              >
                <LogIn size={14} />
                {!isCollapsed && (
                  <span className="font-bold text-xs flex items-center gap-1">
                    Sign In
                  </span>
                )}
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

// Small helper for logout icon
function LogOutIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-log-out"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <AppSidebarContent />
    </Sidebar>
  );
}
