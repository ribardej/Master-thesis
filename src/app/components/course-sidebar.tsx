import { ChevronDown, ChevronRight, CheckCircle2, Circle, Play } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { courseData, getAllLessons, type Module, type Lesson } from "../data/course-data";

export function CourseSidebar() {
  const { lessonId } = useParams();
  // If no lessonId in URL, use the first lesson
  const currentLessonId = lessonId || getAllLessons()[0]?.id;
  
  const [expandedModules, setExpandedModules] = useState<string[]>(
    courseData.modules.map(m => m.id)
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    // Mock completion status - in a real app, this would come from user progress data
    return false;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-semibold text-lg mb-1">{courseData.title}</h2>
        <p className="text-sm text-gray-600">{courseData.description}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {courseData.modules.map((module, moduleIndex) => (
          <ModuleSection
            key={module.id}
            module={module}
            moduleNumber={moduleIndex + 1}
            isExpanded={expandedModules.includes(module.id)}
            onToggle={() => toggleModule(module.id)}
            currentLessonId={currentLessonId}
            isLessonCompleted={isLessonCompleted}
          />
        ))}
      </div>
    </div>
  );
}

interface ModuleSectionProps {
  module: Module;
  moduleNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  currentLessonId?: string;
  isLessonCompleted: (lessonId: string) => boolean;
}

function ModuleSection({
  module,
  moduleNumber,
  isExpanded,
  onToggle,
  currentLessonId,
  isLessonCompleted
}: ModuleSectionProps) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1">Module {moduleNumber}</div>
          <div className="font-medium text-sm">{module.title}</div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="bg-gray-50">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              lessonNumber={lessonIndex + 1}
              isActive={currentLessonId === lesson.id}
              isCompleted={isLessonCompleted(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LessonItemProps {
  lesson: Lesson;
  lessonNumber: number;
  isActive: boolean;
  isCompleted: boolean;
}

function LessonItem({ lesson, lessonNumber, isActive, isCompleted }: LessonItemProps) {
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className={`block px-6 py-3 pl-14 hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-600 pl-[3.25rem]' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : isActive ? (
            <Play className="w-4 h-4 text-blue-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {lessonNumber}. {lesson.title}
          </div>
        </div>
      </div>
    </Link>
  );
}