export type { Slide, Lesson, Module, Course } from "./types";
import type { Course, Lesson } from "./types";
import { module1 } from "./module-1";
import { module2 } from "./module-2";
import { module3 } from "./module-3";

export const courseData: Course = {
  id: "intro-to-web-dev",
  title: "Introduction to Web Development",
  description:
    "Learn the fundamentals of web development including HTML, CSS, and JavaScript",
  modules: [module1, module2, module3],
};

// Helper function to get all lessons in order
export function getAllLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  courseData.modules.forEach((module) => {
    lessons.push(...module.lessons);
  });
  return lessons;
}

// Helper function to find lesson by id
export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}

// Helper function to get next lesson
export function getNextLesson(currentLessonId: string): Lesson | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1];
  }
  return null;
}

// Helper function to get previous lesson
export function getPreviousLesson(currentLessonId: string): Lesson | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1];
  }
  return null;
}
