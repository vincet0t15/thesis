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
    reports: [
        {
            name: 'Attendance Reports',
            url: '/attendance-reports',
            icon: IconReport,
        },
        {
            name: 'Attendee Count Reports',
            url: '/attendee-count-reports',
            icon: IconReport,
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
                        <div className="flex flex-col items-center justify-center text-sm leading-tight group-data-[collapsible=icon]:hidden">
                            <span className="block text-lg font-extrabold text-white uppercase leading-5">Biometric-Based Attendance Monitoring System</span>
                            <span className="block text-[10px] font-bold tracking-wider text-white/90 uppercase mt-1 leading-3">Palawan State University San Vicente Campus</span>
                        </div>
                    </SidebarMenuItem>
                    <div className="my-2 h-[2px] w-full rounded-full bg-white/20" />
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain title="Main" items={data.navMain} />
                <NavDocuments title="Reports" items={data.reports} />
                <NavDocuments title="Settings" items={data.settings} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
