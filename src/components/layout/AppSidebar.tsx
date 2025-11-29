
'use client';
import Link from 'next/link';
import { Home, LineChart, Package, Settings, ShoppingCart, Users2, Crown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { getNavLinksByRole } from '@/lib/nav-data';
import Image from 'next/image';


export function AppSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const navLinks = getNavLinksByRole(user?.role);


    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="/"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Image src="/Plogo.png" alt="Princess Palace Logo" width={40} height={40} className="p-1" />
                        <span className="sr-only">Princesspalace</span>
                    </Link>

                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Tooltip key={href}>
                            <TooltipTrigger asChild>
                            <Link
                                href={href}
                                className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", 
                                    pathname.startsWith(href) && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="sr-only">{label}</span>
                            </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">{label}</TooltipContent>
                        </Tooltip>
                    ))}
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Link
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    )
}
