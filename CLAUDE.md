# App Factory Template

React Native (Expo) boilerplate for Vertical Slice Architecture + LLM-Assisted Development.

## Architecture

- **Features** (`src/features/[name]/`): Self-contained vertical slices. Each has `schema.ts`, `use[Feature].ts`, `components/`, `index.tsx`.
- **Core** (`src/core/`): Cross-cutting modules (auth, payments, remote-config). Never modify Core when building features unless the Blueprint explicitly says so.
- **UI** (`src/ui/`): Stateless reusable components. atoms → molecules → organisms.
- **Config** (`config/`): `contents.json` (copy), `theme.ts` (tokens), `secrets.ts` (API keys, gitignored).

Features communicate only through Core. Never import Feature → Feature directly.

## File Rules (from real bugs)

- **JSX = `.tsx`**: Files containing JSX MUST use `.tsx` extension. `.ts` with JSX causes Metro SyntaxError.
- **Path aliases only**: Use `@src/*` and `@config/*`. Never use relative paths like `../../config/theme`.
- **Metro ignores tsconfig paths**: The real alias resolution is in `babel.config.js` (babel-plugin-module-resolver). If aliases break, check babel.config.js first.
- **Google Sign-In on iOS**: Never static import `@react-native-google-signin/google-signin`. Use `require()` inside `Platform.OS === 'android'` guard. Static import crashes Expo Go on iOS.
- **Style props**: Use `StyleProp<ViewStyle>`, not `ViewStyle`. Import from `react-native`.
- **After babel.config.js changes**: Always run `npx expo start --clear` to reset Metro cache.

## Workflow

- New feature: Fill out `docs/FEATURE_BLUEPRINT_TEMPLATE.md`, then use `/implement-feature`.
- Verify build: Use `/verify-app` after making changes.
- Architecture reference: See `docs/ARCHITECTURE.md`.
- Blueprint examples: See `docs/blueprints/`.
