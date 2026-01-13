import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { IconBuilding, IconCalendarCheck, IconDatabase, IconListDetails, IconReport } from '@tabler/icons-react';
import { Building } from 'lucide-react';
import * as React from 'react';

const data = {
    navMain: [
        {
            title: 'Student',
            url: '/students',
            icon: IconListDetails,
        },
        {
            title: 'Daily Time Record',
            url: '/dtr',
            icon: IconCalendarCheck,
        },
    ],

    settings: [
        {
            name: 'Courses',
            url: '/courses',
            icon: IconBuilding,
        },
        {
            name: 'Events',
            url: '/events',
            icon: IconCalendarCheck,
        },



    ],
};
interface AuthUser {
    name: string;
    email: string;
    avatar: string;
}

interface PageProps extends InertiaPageProps {
    auth: {
        user: AuthUser;
    };
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="text-center">
                        <div className="text-sm leading-tight">
                            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent uppercase">
                                Daily Time Record
                            </span>
                            <span className="block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-[16px] font-bold tracking-wider text-transparent uppercase">
                                Generator
                            </span>
                        </div>
                    </SidebarMenuItem>

                    <div className="my-2 h-[2px] w-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.settings} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
