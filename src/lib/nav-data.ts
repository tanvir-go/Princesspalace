
import { Home, LineChart, Package, ShoppingCart, Users2, Crown, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
    href: string;
    label: string;
    icon: LucideIcon;
}

const allNavLinks: { [key: string]: NavLink } = {
    dashboard: { href: "/dashboard", label: "Dashboard", icon: Home },
    orders: { href: "/orders", label: "Orders", icon: ShoppingCart },
    menu: { href: "/menu", label: "Menu", icon: Package },
    waiter: { href: "/waiter", label: "Waiter", icon: Users2 },
    finance: { href: "/finance", label: "Finance", icon: LineChart },
    admin: { href: "/admin", label: "Admin", icon: Crown },
    pos: { href: "/pos", label: "POS", icon: Terminal },
};

const navConfig: { [key: string]: string[] } = {
    admin: ["dashboard", "orders", "menu", "waiter", "finance", "admin", "pos"],
    accounts: ["dashboard", "orders", "finance", "pos"],
    waiter: ["waiter", "orders"],
    customer: ["dashboard"],
};

export function getNavLinksByRole(role: string | undefined): NavLink[] {
    const roleKey = role && role in navConfig ? role : "customer";
    const linkKeys = navConfig[roleKey] || [];
    return linkKeys.map(key => allNavLinks[key]).filter(Boolean);
}

    