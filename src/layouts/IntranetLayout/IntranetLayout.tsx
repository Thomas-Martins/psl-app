import Navbar from "@layouts/IntranetLayout/Navbar.tsx";
import { Outlet } from "react-router";
import { Card } from "@heroui/react";

export default function IntranetLayout() {
    return (
        <>
            <div className=" relative z-10 px-3 md:px-6 lg:px-8">
                <Navbar />
                <Card className="bg-white shadow-lg absolute m-3 p-2.5 inset-0 top-20 h-full md:mx-6 lg:max-w-screen-xl lg:top-28 xl:m-auto xl:top-64 z-10">
                    <Outlet />
                </Card>
            </div>
            <div className="bg-primary-500 h-96 absolute inset-0 top-0 z-0"></div>
        </>
    );
}
