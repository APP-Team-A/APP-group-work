// src/types/front-matter.d.ts
declare module 'front-matter' {
  interface FrontMatterResult<T> {
    attributes: T;
    body: string;
    frontmatter: string;
  }

  export default function fm<T>(text: string): FrontMatterResult<T>;
}