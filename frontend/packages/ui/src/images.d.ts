// Asset imports resolved by the bundler; typed here since @timo/ui runs tsc with
// `types: []` (no vite/client). The consuming app supplies the real modules.
declare module "*.png" {
  const src: string;
  export default src;
}
