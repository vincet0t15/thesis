'use client';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { type Icon } from '@tabler/icons-react';

export function NavDocuments({
    title,
    items,
    ...props
}: {
    title: string;
    items: {
        name: string;
        url: string;
        icon: Icon;
    }[];
} & React.HTMLAttributes<HTMLDivElement>) {
    const { url } = usePage();
    const page = usePage();
    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = url.startsWith(item.url);

                    return (
                        <SidebarMenuItem key={item.name} data-active={isActive}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.url)} tooltip={{ children: item.name }}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}