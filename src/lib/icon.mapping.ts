import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiSettings,
  FiUsers,
  FiFileText,
  FiCalendar,
  FiMail,
  FiBell,
  FiInfo,
  FiGrid,
  FiFolder,
  FiBook,
  FiHeart,
  FiStar,
  FiShield,
  FiDatabase,
  FiMonitor,
  FiPackage,
} from "react-icons/fi";
import type { IconType } from "react-icons";

export const iconMapping: Record<string, IconType> = {
  home: FiHome,
  "trending-up": FiTrendingUp,
  compass: FiCompass,
  settings: FiSettings,
  users: FiUsers,
  "file-text": FiFileText,
  calendar: FiCalendar,
  mail: FiMail,
  bell: FiBell,
  info: FiInfo,
  grid: FiGrid,
  folder: FiFolder,
  book: FiBook,
  heart: FiHeart,
  star: FiStar,
  shield: FiShield,
  database: FiDatabase,
  monitor: FiMonitor,
  package: FiPackage,
};

export const getIconComponent = (iconName: string): IconType => {
  return iconMapping[iconName] || FiFileText; // Default icon
};
