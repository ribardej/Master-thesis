import { useParams, useSearchParams } from "react-router";
import { getLessonById, getAllLessons } from "../data/course-data";
import { SlideContent } from "../components/slide-content";

export function Lesson() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();

  // If no lessonId, show the first lesson
  const targetLessonId = lessonId || getAllLessons()[0]?.id;

  if (!targetLessonId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No lessons available</h2>
          <p className="text-gray-600">There are no lessons in this course.</p>
        </div>
      </div>
    );
  }

  const lesson = getLessonById(targetLessonId);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Lesson not found</h2>
          <p className="text-gray-600">
            The lesson you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const slideParam = searchParams.get("slide");
  const slideIndex = slideParam ? Math.max(0, Math.min(parseInt(slideParam, 10) - 1, lesson.slides.length - 1)) : 0;
  const slide = lesson.slides[slideIndex];

  return (
    <div className="h-full overflow-y-auto pb-20 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-8 py-12 w-full">
        <div className="prose prose-lg max-w-none">
          <SlideContent content={slide.content} />
        </div>
      </div>
    </div>
  );
}