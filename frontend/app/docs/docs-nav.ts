export interface NavItem { label: string; href: string; hasChevron?: boolean; }
export interface NavSection { heading: string; items: NavItem[]; }
export const QUICK_LINKS: NavItem[] = [
  { label: 'Report an Issue', href: '#' },
  { label: 'Blog', href: '#' },
];
export const NAV_SECTIONS: NavSection[] = [
  { heading: 'Getting Started', items: [{ label: 'Get started with Reown', href: '#' }, { label: 'Pricing Plans', href: '#', hasChevron: true }] },
  { heading: 'Accounts & Authentication', items: [{ label: 'Authentication', href: '#', hasChevron: true }, { label: 'Smart Accounts', href: '#', hasChevron: true }, { label: 'Multiwallet Linking', href: '#' }] },
  { heading: 'Data', items: [{ label: 'Analytics', href: '#' }] },
];
