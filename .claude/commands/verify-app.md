Run the following verification steps and fix any errors found. Do not stop until all checks pass.

## Step 1: TypeScript Type Check
```bash
npx tsc --noEmit
```
If there are type errors, fix them and re-run until clean.

## Step 2: Metro Bundle Build
```bash
npx expo export --platform ios
```
If the bundle fails (broken imports, missing modules, syntax errors), fix them and re-run until clean.

## Step 3: Report
Output a summary:
- TypeScript: PASS / FAIL (number of errors fixed)
- Metro Build: PASS / FAIL (number of errors fixed)
- Files modified during fixes (if any)
