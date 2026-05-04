"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid } from "lucide-react";
import { useSession } from "next-auth/react";

function ReportNavbar() {
    const { data: session } = useSession();

    const homeHref = useMemo(() => {
        if (session?.user?.is_admin) return "/admin";
        if (session?.user?.is_gm) return "/gm";
        if (session?.user?.is_finance) return "/finance";
        if (session?.user?.is_reservations) return "/reservations";
        if (session?.user?.is_manager) return "/managers";
        if (session?.user?.is_employee) return "/employees";
        if (session?.user?.is_auditor) return "/auditor";
        if (session?.user?.is_it) return "/it";
        return "/";
    }, [session]);

    const navItems = [
        { label: "Dashboard", href: homeHref, icon: LayoutGrid },
    ];

    return (
        <Navbar
            brand="TML | Reports"
            subtitle="Reports Portal"
            navItems={navItems}
            homeHref={homeHref}
            logoutCallback="/"
        />
    );
}

export default ReportNavbar;
