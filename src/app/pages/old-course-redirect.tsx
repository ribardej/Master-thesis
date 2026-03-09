import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";

export function OldCourseRedirect() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on /course/lesson/:lessonId
    if (lessonId && location.pathname.includes("/course/lesson/")) {
      navigate(`/lesson/${lessonId}`, { replace: true });
    } else {
      // Just /course, redirect to home
      navigate("/", { replace: true });
    }
  }, [navigate, lessonId, location.pathname]);
  
  return null;
}
