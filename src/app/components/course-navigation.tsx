import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  getLessonById,
  getNextLesson,
  getPreviousLesson,
  getAllLessons,
} from "../data/course-data";

export function CourseNavigation() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentLessonId = lessonId || getAllLessons()[0]?.id;
  if (!currentLessonId) return null;

  const lesson = getLessonById(currentLessonId);
  if (!lesson) return null;

  const slideParam = searchParams.get("slide");
  const totalSlides = lesson.slides.length;
  const slideIndex = slideParam
    ? Math.max(0, Math.min(parseInt(slideParam, 10) - 1, totalSlides - 1))
    : 0;

  const isFirstSlide = slideIndex === 0;
  const isLastSlide = slideIndex === totalSlides - 1;
  const previousLesson = getPreviousLesson(currentLessonId);
  const nextLesson = getNextLesson(currentLessonId);

  const canGoPrev = !isFirstSlide || !!previousLesson;
  const canGoNext = !isLastSlide || !!nextLesson;

  const goTo = (lessonId: string, slide: number) => {
    navigate(`/lesson/${lessonId}?slide=${slide}`);
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      goTo(currentLessonId, slideIndex); // slide param is 1-based, slideIndex is 0-based
    } else if (previousLesson) {
      goTo(previousLesson.id, previousLesson.slides.length);
    }
  };

  const handleNext = () => {
    if (!isLastSlide) {
      goTo(currentLessonId, slideIndex + 2);
    } else if (nextLesson) {
      goTo(nextLesson.id, 1);
    }
  };

  const progressPercent = totalSlides > 1
    ? ((slideIndex) / (totalSlides - 1)) * 100
    : 100;

  return (
    <div className="fixed bottom-0 left-80 right-0 bg-white border-t border-gray-200 z-10">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between px-8 py-3">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrev}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-sm text-gray-500">
          {slideIndex + 1} / {totalSlides}
        </span>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
