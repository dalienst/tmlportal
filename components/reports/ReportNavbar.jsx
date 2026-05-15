"use client";

import React, { useMemo } from "react";
import Navbar from "@/components/general/Navbar";
import { LayoutGrid, ArrowLeft, BarChart3, Home } from "lucide-react";
import { useSession } from "next-auth/react";

function ReportNavbar() {
    const { data: session } = useSession();

    const portalInfo = useMemo(() => {
        if (session?.user?.is_admin) return { name: "Admin", href: "/admin" };
        if (session?.user?.is_gm) return { name: "GM", href: "/gm" };
        if (session?.user?.is_finance) return { name: "Finance", href: "/finance" };
        if (session?.user?.is_reservations) return { name: "Reservations", href: "/reservations" };
        if (session?.user?.is_manager) return { name: "Manager", href: "/managers" };
        if (session?.user?.is_employee) return { name: "Employee", href: "/employees" };
        if (session?.user?.is_auditor) return { name: "Auditor", href: "/auditor" };
        if (session?.user?.is_it) return { name: "IT", href: "/it" };
        return { name: "Home", href: "/" };
    }, [session]);

    const navItems = [
        { label: "Reports Overview", href: "/reports", icon: BarChart3 },
        { label: `Exit to ${portalInfo.name} Portal`, href: portalInfo.href, icon: Home },
    ];

    return (
        <Navbar
            brand="TML | Reports"
            subtitle={`${portalInfo.name} Analytics Console`}
            navItems={navItems}
            homeHref="/reports"
            logoutCallback="/"
        />
    );
}

export default ReportNavbar;
