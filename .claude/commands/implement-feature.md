The user will paste a Feature Blueprint. Implement it following these steps strictly:

1. **Parse the Blueprint**: Extract feature name, data schema, core dependencies, UI states, and screen layout.

2. **Create files in order**:
   - `src/features/$FEATURE_NAME/schema.ts` — Zod schema from the Blueprint's Data section
   - `src/features/$FEATURE_NAME/use$FEATURE_NAME.ts` — Logic hook (state, actions, core integrations)
   - `src/features/$FEATURE_NAME/components/` — UI components from the Blueprint's Screen section
   - `src/features/$FEATURE_NAME/components/index.ts` — Re-export all components
   - `src/features/$FEATURE_NAME/index.tsx` — Main screen composing hook + components (this is the only public export)

3. **Wire routing**: Add the new screen to `App.tsx` with appropriate AppState and navigation callbacks.

4. **Follow project rules** (from CLAUDE.md):
   - Use `.tsx` for any file with JSX
   - Use `@src/*` and `@config/*` path aliases (never relative paths)
   - Import UI primitives from `@src/ui/atoms` and `@src/ui/molecules`
   - Import core modules from `@src/core/*`
   - Load content text from `config/contents.json`

5. **Verify**: Run `npx tsc --noEmit` to check for type errors. Fix any errors found.

6. **Report**: List all created/modified files with a brief summary of each.
