import { IoIosPeople, IoIosNotifications, IoIosChatbubbles } from "react-icons/io";
import React from "react"
import { AiOutlineHome } from "react-icons/ai";
import { RxCalendar } from "react-icons/rx";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

interface MenuItem {
    navIcon: React.FC;
    navTitle: string;
    navLink: string;
}

export const SideBarMenu: MenuItem[] = [
    {
        navIcon: AiOutlineHome,
        navTitle: "Home",
        navLink: "/app",
    },
    {
        navIcon: IoIosChatbubbles,
        navTitle: "Sentiment Analysis",
        navLink: "/app/sentiment-dashboard",
    },
    {
        navIcon: IoIosPeople,
        navTitle: "Communities",
        navLink: "/app/#",
    },
    {
        navIcon: RxCalendar,
        navTitle: "Events",
        navLink: "/app/#",
    },
    {
        navIcon: LiaChalkboardTeacherSolid,
        navTitle: "Educators",
        navLink: "/app/#",
    },
    {
        navIcon: IoIosNotifications,
        navTitle: "Notifications",
        navLink: "/app/#",
    },
]

export const HomeNavTab = ["Proposals", "Intending Proposals", "Community Post"]
export const ProposalDetailsNav = ["Proposal details", "Comments"]