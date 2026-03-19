export type { Slide, Lesson, Module, Course } from "./types";
import type { Course, Lesson } from "./types";
import { module1 } from "./module-1";
import { module2 } from "./module-2";

export const courseData: Course = {
  id: "quantum-cryptography",
  title: "Quantum-Safe Cryptography",
  description:
    "A comprehensive guide to cryptographic fundamentals, quantum threats, and post-quantum solutions for secure communication",
  modules: [module1, module2],
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
