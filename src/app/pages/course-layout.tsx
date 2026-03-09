import { useState } from "react";
import { Outlet } from "react-router";
import { CourseSidebar } from "../components/course-sidebar";
import { CourseNavigation } from "../components/course-navigation";

export function CourseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <CourseSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <div className="flex-1 bg-gray-50 relative">
        <Outlet />
        <CourseNavigation sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
}