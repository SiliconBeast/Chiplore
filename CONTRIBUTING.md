# Contributing to Chiplore

Thanks for helping make hardware less scary. The most useful thing you can add is **one good lesson**.

## Write a lesson

1. Pick a planned item from `src/data/courses.js` (anything without an `href`), or open an issue to propose a new one.
2. Create `src/content/lessons/<course>/<lesson>.mdx`. Copy `digital-logic/clocks-and-edges.mdx` as a starting point.
3. Fill in the frontmatter:

   ```yaml
   title: Setup and hold, gently
   course: digital-logic
   unit: 2
   order: 3
   minutes: 10
   art: clock            # see src/components/CourseArt.astro
   skill: Setup and hold # must match a skill name in courses.js
   summary: One sentence on why the learner should care.
   next:
     title: Next lesson title
     href: /learn/digital-logic/next-lesson/
   ```

4. Add the lesson's `href` to its item in `src/data/courses.js` so it shows up on the course page.
5. Run `npm run dev` and read it in the browser before opening a pull request.

## Lesson style

- **Start with why.** The first paragraph says why this matters, in plain words.
- **Short sentences, short paragraphs.** Define a term the first time you use it (use `<Note term="...">`).
- **Let the learner do something.** End with at least one `<Quiz>`, and add a runnable or interactive part when you can.
- **Be exact.** Numbers, units and timing must be right. Cite a source for anything surprising.
- **No walls of text, no tinted boxes, no emoji.** Use the components that exist.

## Code

- Keep pages static and fast. Interactive parts are small vanilla scripts inside components.
- Respect `prefers-reduced-motion`. Every animation must degrade to a fade or nothing.
- Keyboard and screen-reader users must be able to do everything a mouse user can.

## Licences

By contributing you agree that code is released under MIT and lesson content under CC BY-SA 4.0.
