import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const vitalsConfigs = nextVitals.filter(c => !c.ignores).map(c => ({
  ...c,
  ignores: c.files ? undefined : [".next/**", "out/**", "build/**", "next-env.d.ts"],
}));
const tsConfigs = nextTs.filter(c => !c.ignores).map(c => ({
  ...c,
  ignores: c.files ? undefined : [".next/**", "out/**", "build/**", "next-env.d.ts"],
}));

export default [
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "*.config.ts", "*.config.js"]),
  ...vitalsConfigs,
  ...tsConfigs,
];