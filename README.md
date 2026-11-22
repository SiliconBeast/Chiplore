# Chiplore

**Learn how chips and circuit boards really work.** Free, open-source, hands-on lessons from a single logic gate to your own chip and the board it sits on. Everything runs in the browser: no installs, no accounts, no tracking.

Live site: https://siliconbeast.github.io/Chiplore/

## What's here

| | |
|---|---|
| **Courses** | Digital logic and Verilog is open. Eight more courses are planned and looking for writers. |
| **Lessons** | MDX files with live code. Edit `q <= d;`, press Run, and the waveform redraws. |
| **Practice** | Draw a flip-flop's output cycle by cycle, with hints that mark the rising edges. |
| **Lab** | A classic interview problem (rising-edge detector) with tests, waves and a schematic. |
| **Roadmaps** | Six hardware roles, each routed stage by stage through the units it needs. |
| **Mastery** | Every skill is an eye diagram: colour is what you earned, sharpness is how fresh it is. Progress stays in your browser. |

The lesson and Lab simulations use a small teaching simulator (`src/lib/bitsim.js`) that understands single-bit expressions. Full Verilog in the browser (Icarus Verilog, Verilator, Yosys via WebAssembly) is next on the roadmap.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321/Chiplore/
npm run build    # static site in dist/
```

Built with [Astro](https://astro.build) and MDX. Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## Project layout

```
src/
  content/lessons/<course>/<lesson>.mdx   lessons (frontmatter: title, unit, skill, next...)
  data/courses.js                         courses, units, skills, roadmaps
  components/                             TryIt, Quiz, GatePlay, Zoom, Eye, CourseArt...
  lib/bitsim.js                           teaching simulator
  lib/eye.js                              mastery glyphs
  pages/                                  routes
```

## Contributing

The most useful contribution is a single good lesson. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

- Code: [MIT](LICENSE)
- Lesson content in `src/content/`: [CC BY-SA 4.0](LICENSE-CONTENT.md)
