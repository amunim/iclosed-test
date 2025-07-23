"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CalendarIcon from "@/components/icons/calendar"
import AnalyticsIcon from "@/components/icons/analytics"
import GlobeIcon from "@/components/icons/globe"
import TargetIcon from "@/components/icons/target"
import MembersIcon from "@/components/icons/members"
import BookIcon from "@/components/icons/book"
import IntegrationIcon from "@/components/icons/integration"
import SettingsIcon from "@/components/icons/settings"
import { Avatar } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onToggle?: () => void
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function Sidebar({ collapsed = false, onToggle, className, ...props }: SidebarProps) {
  const pathname = usePathname()

  const NavItem = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const debouncedOpen = useDebounce(open, 200);

    const handleMouseEnter = () => {
      setOpen(true);
    };

    const handleMouseLeave = () => {
      setOpen(false);
    };

    return (
      <div className="relative text-center">
        {collapsed ? (
          <Popover open={debouncedOpen} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Link
                href={href}
                className={cn(
                  "flex items-center px-2 py-2 rounded-md transition-all duration-200 group text-white hover:bg-[#171E3C]",
                  pathname === href && "border border-gray-700 bg-[#1E2657]",
                  "justify-center px-1",
                  "h-8 w-8"
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Icon className="h-4 w-4 text-white" />
              </Link>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={10}
              className="w-auto p-2 bg-sidebar text-xs text-white border-sidebar-border rounded-md"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {children}
            </PopoverContent>
          </Popover>
        ) : (
          <Link
            href={href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-all duration-200 group text-white hover:bg-[#171E3C]",
              pathname === href && "border border-gray-700 bg-[#1E2657]",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-3 text-right">{children}</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        `h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-sidebar-border shadow-sm transition-all duration-300 ease-in-out`,
        collapsed ? "w-14" : "w-64",
        className
      )}
      style={{ background: "linear-gradient(90deg, rgb(19, 37, 93) -70.68%, rgb(4, 1, 42) 100%)" }}
      {...props}
    >
      <div className={cn("flex mt-2 h-16 items-center justify-between px-4 border-b border-gray-700",
        collapsed && "flex-col justify-end"
      )}>
        <div className={cn("text-lg font-semibold text-sidebar-foreground transition-all duration-200",
          "flex items-center")}>
          <svg width={collapsed ? "25" : "20"} height={collapsed ? "25" : "20"} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.481302 0.832031C1.0531 0.832203 10.1763 0.832031 10.1763 0.832031C9.20264 1.35886 7.17027 2.66062 6.82982 3.65296C11.689 0.515868 19.498 1.18535 19.6592 1.23801C19.8204 1.29067 20.0657 1.37078 19.9836 1.69467C19.9016 2.01856 10.8641 18.1615 10.4772 18.8818C10.3291 19.1574 9.88852 19.3934 9.45679 18.7751C9.02506 18.1568 7.22091 14.7928 6.81856 13.9605C6.92985 12.0238 9.92483 8.89479 13.3293 6.49396C10.3504 7.73439 7.2493 10.2307 5.9912 12.6526C5.40321 11.6286 4.82429 10.6232 4.70822 10.4134C4.31632 9.70502 1.66696 5.40156 0.135982 1.96785C-0.0786108 1.48656 -0.0904905 0.83186 0.481302 0.832031Z" fill="white" />
          </svg>
          {!collapsed && "iClosed"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("hover:bg-[#171E3C] h-8 w-8 rounded-md transition-all duration-200 cursor-pointer", collapsed && "ml-0")}
          onClick={onToggle}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-4 w-4 text-white transition-transform mx-[2px]", collapsed && "rotate-180")}>
            <g id="collapsesidebar"><path id="Vector" d="M2.6665 4.00002C2.6665 3.6464 2.80698 3.30726 3.05703 3.05721C3.30708 2.80716 3.64622 2.66669 3.99984 2.66669H11.9998C12.3535 2.66669 12.6926 2.80716 12.9426 3.05721C13.1927 3.30726 13.3332 3.6464 13.3332 4.00002V12C13.3332 12.3536 13.1927 12.6928 12.9426 12.9428C12.6926 13.1929 12.3535 13.3334 11.9998 13.3334H3.99984C3.64622 13.3334 3.30708 13.1929 3.05703 12.9428C2.80698 12.6928 2.6665 12.3536 2.6665 12V4.00002Z" stroke="#D1D5DB" strokeLinecap="round" strokeLinejoin="round"></path><path id="Vector_2" d="M6 2.66669V13.3334" stroke="#D1D5DB" strokeLinecap="round" strokeLinejoin="round"></path><path id="Vector_3" d="M9.99984 6.66669L8.6665 8.00002L9.99984 9.33335" stroke="#D1D5DB" strokeLinecap="round" strokeLinejoin="round"></path></g>
          </svg>
        </Button>
      </div>

      <div className="flex justify-between flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-2">
            <NavItem href="/overview" icon={CalendarIcon}>AI Schedular</NavItem>
            <NavItem href="/task-logs" icon={AnalyticsIcon}>Analytics</NavItem>
            <NavItem href="/tasks/sample-data" icon={GlobeIcon}>Global Data</NavItem>
            <NavItem href="/contact" icon={TargetIcon}>Tracking <Badge className="text-[10px] leading-normal font-normal text-white border border-blue-400 rounded px-1 bg-transparent ml-2">BETA</Badge></NavItem>
            <NavItem href="/contact" icon={MembersIcon}>Members</NavItem>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col justify-end">
          <div className="space-y-2">
            <NavItem href="/docs" icon={BookIcon}>Documentation</NavItem>
            <NavItem href="/integrations" icon={IntegrationIcon}>Integrations</NavItem>
            <NavItem href="/settings" icon={SettingsIcon}>Settings</NavItem>
          </div>
          <div className="mt-2">
            {collapsed && <Avatar className="w-10 h-10 rounded-full flex items-center justify-center mt-4 shrink-0"
              style={{ background: "linear-gradient(37.58deg, #001D6B -92.47%, #031953 -92.47%, #1044CE 74.77%)" }}>A</Avatar>}
            {!collapsed &&
              <div className="px-2">
                <div className="cursor-pointer flex justify-between items-center w-full border rounded-md border-gray-700 p-2 pb-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs"
                      style={{ background: "linear-gradient(37.58deg, #001D6B -92.47%, #031953 -92.47%, #1044CE 74.77%)" }}>A</Avatar>
                    <span className="text-sm font-medium text-white text-left truncate false">Abdul Munim</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white" />
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}