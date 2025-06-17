"use client";

import * as React from "react";
import { ChevronDown, Menu, Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

interface NavigationMenuProps {
  items: NavItem[];
  logo?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onSearch?: (query: string) => void;
  className?: string;
}

export function NavigationMenu({
  items,
  logo,
  user,
  onSearch,
  className,
}: NavigationMenuProps) {
  const pathname = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <nav
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <MobileNav items={items} onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            {logo && <div className="flex items-center">{logo}</div>}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {items.map((item, index) => (
              <NavItemComponent
                key={index}
                item={item}
                pathname={pathname.toString()}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {onSearch && (
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItemComponent({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-1">
            {item.icon && <span className="h-4 w-4">{item.icon}</span>}
            <span>{item.title}</span>
            <ChevronDown className="h-4 w-4" />
            {item.badge && (
              <Badge variant="secondary" className="ml-2">
                {item.badge}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {item.children?.map((child, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link
                to={child.href || "#"}
                className="flex items-center space-x-2"
              >
                {child.icon && <span className="h-4 w-4">{child.icon}</span>}
                <span>{child.title}</span>
                {child.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {child.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "flex items-center space-x-2",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      <Link to={item.href || "#"}>
        {item.icon && <span className="h-4 w-4">{item.icon}</span>}
        <span>{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-2">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

function MobileNav({
  items,
  onClose,
}: {
  items: NavItem[];
  onClose: () => void;
}) {
  const pathname = useLocation();

  return (
    <div className="flex flex-col space-y-3 pt-6">
      {items.map((item, index) => (
        <MobileNavItem
          key={index}
          item={item}
          pathname={pathname.toString()}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

function MobileNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = React.useState(false);

  if (hasChildren) {
    return (
      <div>
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            {item.icon && <span className="h-4 w-4">{item.icon}</span>}
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>
        {isOpen && (
          <div className="ml-4 mt-2 space-y-2">
            {item.children?.map((child, index) => (
              <Button
                key={index}
                variant="ghost"
                asChild
                className="w-full justify-start"
                onClick={onClose}
              >
                <Link to={child.href || "#"}>
                  {child.icon && (
                    <span className="h-4 w-4 mr-2">{child.icon}</span>
                  )}
                  {child.title}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start",
        isActive && "bg-accent text-accent-foreground",
      )}
      onClick={onClose}
    >
      <Link to={item.href || "#"}>
        {item.icon && <span className="h-4 w-4 mr-2">{item.icon}</span>}
        {item.title}
        {item.badge && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
