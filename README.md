# Vitest Coverage Merge Bug Reproduction

Minimal reproduction for [vitest#9366](https://github.com/vitest-dev/vitest/issues/9366).

## Status: fixed in Vitest 5.1.1

The bug is fixed in `@vitest/istanbul-lib-coverage@2.1.1` ([vitest-dev/istanbuljs#25](https://github.com/vitest-dev/istanbuljs/pull/25), [vitest-dev/vitest#12040](https://github.com/vitest-dev/vitest/pull/12040)), which a fresh install of Vitest 5.1.1 picks up. This branch now uses Vitest 5.1.1, and `src/constants.ts` reports the expected 3 statements.

Some cases are still duplicated on 2.1.1 (start columns that differ between transforms, and end columns that differ when both are known). They are reproduced on the [`repro/start-column-mismatch`](https://github.com/stevez/vitest-coverage-merge-bug/tree/repro/start-column-mismatch) branch.

## Bug Description

When the same file is covered by multiple projects with different environments (e.g., `jsdom` unit tests + `browser` component tests), coverage entries are duplicated, resulting in inflated statement counts.

## Steps to Reproduce

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests with coverage:
   ```bash
   npm run test:coverage
   ```

3. Check `coverage/coverage-final.json` for `src/constants.ts`:
   - **Expected:** 3 statements
   - **Before Vitest 5.1.1:** 6 statements (duplicated)

4. Or run the check script:
   ```bash
   node check-coverage.cjs
   ```

   Output before Vitest 5.1.1 showed duplicate statements:
   ```
   File: constants.ts
     Statements: 6
       [0] line 1:22 -> 7:null      <- from jsdom
       [1] line 9:21 -> 9:null      <- from jsdom
       [2] line 11:22 -> 15:null    <- from jsdom
       [3] line 1:22 -> 7:10        <- from browser (duplicate!)
       [4] line 9:21 -> 9:58        <- from browser (duplicate!)
       [5] line 11:22 -> 15:10      <- from browser (duplicate!)
   ```

## Root Cause

Vite's SSR transform (used for jsdom environments) produces source maps with `end.column: null`, while the browser transform produces specific end column values. Istanbul's `merge()` treats these as different statements because the locations don't match exactly.

## Related

- Issue: https://github.com/vitest-dev/vitest/issues/9366
- Fix: [vitest-dev/istanbuljs#25](https://github.com/vitest-dev/istanbuljs/pull/25), [vitest-dev/vitest#12040](https://github.com/vitest-dev/vitest/pull/12040)
- Earlier PR (closed): https://github.com/vitest-dev/vitest/pull/9365
