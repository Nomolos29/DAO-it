import { IoIosPeople, IoIosPerson, IoIosNotifications } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import React from "react"

interface MenuItem {
    navIcon: React.FC;
    navTitle: string;
    navLink: string;
}

export const SideBarMenu: MenuItem[] = [
    {
        navIcon: RiHome2Fill,
        navTitle: "Home",
        navLink: "/app",
    },
    {
        navIcon: IoIosPerson,
        navTitle: "Profile",
        navLink: "/app/#",
    },
    {
        navIcon: IoIosPeople,
        navTitle: "Communities",
        navLink: "/app/#",
    },
    {
        navIcon: IoIosNotifications,
        navTitle: "Notifications",
        navLink: "/app/#",
    },
    {
        navIcon: FaChalkboardTeacher,
        navTitle: "Educators",
        navLink: "/app/#",
    }
]

export const HomeNavTab = ["Proposals", "Intending Proposals", "Community Post"]
export const ProposalDetailsNav = ["Proposal details", "Comments"]