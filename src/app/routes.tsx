import { createBrowserRouter } from "react-router";
import { CourseLayout } from "./pages/course-layout";
import { Lesson } from "./pages/lesson";
import { OldCourseRedirect } from "./pages/old-course-redirect";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: CourseLayout,
    children: [
      {
        index: true,
        Component: Lesson,
      },
      {
        path: "lesson/:lessonId",
        Component: Lesson,
      },
      {
        path: "course",
        Component: OldCourseRedirect,
      },
      {
        path: "course/lesson/:lessonId",
        Component: OldCourseRedirect,
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);
