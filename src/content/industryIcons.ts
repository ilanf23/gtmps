import {
  Briefcase,
  Scale,
  Calculator,
  Server,
  TrendingUp,
  Compass,
  UserSearch,
  Palette,
  type LucideIcon,
} from 'lucide-react';
import type { VerticalSlug } from '@/content/verticals';

export const INDUSTRY_ICONS: Record<VerticalSlug, LucideIcon> = {
  consulting: Briefcase,
  law: Scale,
  accounting: Calculator,
  msp: Server,
  advisory: TrendingUp,
  ae: Compass,
  recruiting: UserSearch,
  agency: Palette,
};
