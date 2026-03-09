import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { getNextLesson, getPreviousLesson, getAllLessons } from "../data/course-data";

export function CourseNavigation() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  
  // If no lessonId, use the first lesson
  const currentLessonId = lessonId || getAllLessons()[0]?.id;

  if (!currentLessonId) {
    return null;
  }

  const nextLesson = getNextLesson(currentLessonId);
  const previousLesson = getPreviousLesson(currentLessonId);

  const handlePrevious = () => {
    if (previousLesson) {
      navigate(`/lesson/${previousLesson.id}`);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-2">
      <button
        onClick={handlePrevious}
        disabled={!previousLesson}
        className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        aria-label="Previous lesson"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      <div className="w-px h-8 bg-gray-300"></div>
      
      <button
        onClick={handleNext}
        disabled={!nextLesson}
        className="w-12 h-12 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        aria-label="Next lesson"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
