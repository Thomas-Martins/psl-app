import Navbar from "@layouts/IntranetLayout/Navbar.tsx";
import { Outlet } from "react-router";
import { Card } from "@heroui/react";

export default function IntranetLayout() {
    return (
        <>
            <div className=" relative z-10 px-3 md:px-6 lg:px-8">
                <Navbar />
                <Card className="max-w-screen-xl mx-auto mt-5 p-5">
                    <Outlet />
                </Card>
            </div>
        </>
    );
}
