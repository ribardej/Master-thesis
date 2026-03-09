export interface Slide {
  title: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  slides: Slide[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}
