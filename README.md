# Vitest Coverage Merge Bug Reproduction

Minimal reproduction for duplicated coverage entries when the same file is covered by a `jsdom` project and a `browser` project in one Vitest run ([vitest#9366](https://github.com/vitest-dev/vitest/issues/9366)).

## Status

The original case is **fixed** in `@vitest/istanbul-lib-coverage@2.1.1` ([vitest-dev/istanbuljs#25](https://github.com/vitest-dev/istanbuljs/pull/25), picked up by [vitest-dev/vitest#12040](https://github.com/vitest-dev/vitest/pull/12040)). A fresh install of Vitest 5.1.1 resolves it.

Two cases are **still duplicated** on 2.1.1, and this branch reproduces them:

| File | Case | Vite 7 | Vite 8 |
|------|------|--------|--------|
| `src/constants.ts` | End column unknown on one side (original bug) | ✅ fixed | ✅ fixed |
| `src/Stars.tsx` | **Start column differs** between transforms | ❌ duplicated | ✅ not triggered |
| `src/limits.ts` | **End column differs**, both known | ❌ duplicated | ❌ duplicated |

The merged fix only matches entries that share the same start and end line and differ by an *unknown* end column. Its description notes that function ranges differing in start column are not handled.

## Steps to reproduce

```bash
npm install
npm run check
```

`npm run check` ([compare-projects.cjs](compare-projects.cjs)) runs the `unit` project alone, the `browser` project alone, then both together. It flags every file where the merged report has more statements or functions than either project produced on its own.

Output with Vitest 5.1.1, Vite 7.3.8, `@vitest/istanbul-lib-coverage` 2.1.1:

```
ok         Button.tsx       statements 5 (max per project 5), functions 1 (max per project 1)
DUPLICATED Stars.tsx        statements 10 (max per project 8), functions 6 (max per project 5)
             statement 1:32-1:null    browser only
             statement 4:32-4:null    browser only
             statement 10:8-11:null   browser only
             statement 4:29-4:null    unit only
             statement 9:31-11:null   unit only
             function 10:8-11:null   browser only
             function 9:31-11:null   unit only
ok         constants.ts     statements 3 (max per project 3), functions 0 (max per project 0)
DUPLICATED limits.ts        statements 3 (max per project 2), functions 0 (max per project 0)
             statement 1:31-1:46      browser only
             statement 2:25-2:28      browser only
             statement 1:31-1:47      unit only
```

## The two remaining cases

### Start column differs (`Stars.tsx`, Vite 7)

```tsx
{[...Array(max)].map((_, i) => (
  <span key={i}>★</span>
))}
```

Vite 7's SSR transform (used by the `jsdom` project) maps the callback to the arrow at `9:31`. The browser transform maps it to the JSX at `10:8`. Both describe the same function, but their start positions differ, so `merge()` keeps both. The same happens for `const [hovered, setHovered] = useState(0)` (`4:29` vs `4:32`).

With Vite 8 the two transforms agree, so this case does not show up.

### End column differs, both known (`limits.ts`)

```ts
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
```

The `jsdom` project ends this statement at `1:47` and the browser project at `1:46`. Neither end column is unknown, so the 2.1.1 fix does not apply and both entries are kept. This happens on Vite 7 and Vite 8.

## Original case (fixed)

Vite's SSR transform produced `end.column: null` (`Infinity` in memory) while the browser transform produced a real column, so `src/constants.ts` reported 6 statements instead of 3. `node check-coverage.cjs` prints the statement locations in `coverage/coverage-final.json` if you want to inspect them directly.

## Related

- Issue: [vitest-dev/vitest#9366](https://github.com/vitest-dev/vitest/issues/9366)
- Fix: [vitest-dev/istanbuljs#25](https://github.com/vitest-dev/istanbuljs/pull/25), [vitest-dev/vitest#12040](https://github.com/vitest-dev/vitest/pull/12040)
- Earlier attempt against the original package: [istanbuljs/istanbuljs#838](https://github.com/istanbuljs/istanbuljs/pull/838)
