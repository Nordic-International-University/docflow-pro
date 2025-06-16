import type { RouteObject } from "react-router-dom";
import type { IconType } from "react-icons";
import { getIconComponent } from "@/lib/icon.mapping";

export interface SidebarMenuItem {
  name: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
  permissions?: string[];
  auth?: boolean;
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItem[];
}

export const generateSidebarMenu = (
  routes: RouteObject[],
): SidebarMenuGroup[] => {
  // Routes dan sidebar da ko'rsatiladigan elementlarni filter qilish
  const sidebarRoutes = routes.filter((route) => {
    const handle = route.handle as any;
    return (
      handle &&
      handle.title &&
      handle.layout !== false && // layout false bo'lsa sidebar da ko'rsatmaslik
      route.path &&
      route.path !== "/" // Root path ni exclude qilish
    );
  });

  // Kategoriyalar bo'yicha guruhlash (ixtiyoriy)
  const navigationItems: SidebarMenuItem[] = [];
  const settingsItems: SidebarMenuItem[] = [];

  sidebarRoutes.forEach((route) => {
    const handle = route.handle as any;
    const menuItem: SidebarMenuItem = {
      name: handle.title,
      icon: handle.icon,
      href: route.path as string,
      permissions: handle.permissions,
      auth: handle.auth,
    };

    // Settings kategoriyasiga tegishli routelar
    if (handle.category === "settings" || route.path?.includes("settings")) {
      settingsItems.push(menuItem);
    } else {
      navigationItems.push(menuItem);
    }
  });

  return [
    {
      title: "Navigation",
      items: navigationItems,
    },
    {
      title: "Settings",
      items: settingsItems,
    },
  ].filter((group) => group.items.length > 0); // Bo'sh guruhlarni olib tashlash
};
