# Vitest Coverage Merge Bug Reproduction

Minimal reproduction for [vitest#9366](https://github.com/vitest-dev/vitest/issues/9366).

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
   - **Actual:** 6 statements (duplicated)

4. Or run the check script:
   ```bash
   node check-coverage.cjs
   ```

   Output shows duplicate statements:
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
- PR: https://github.com/vitest-dev/vitest/pull/9365
