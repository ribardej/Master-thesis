import { Outlet } from "react-router";
import { CourseSidebar } from "../components/course-sidebar";
import { CourseNavigation } from "../components/course-navigation";

export function CourseLayout() {
  return (
    <div className="flex h-screen">
      <CourseSidebar />
      <div className="flex-1 bg-gray-50 relative">
        <Outlet />
        <CourseNavigation />
      </div>
    </div>
  );
}