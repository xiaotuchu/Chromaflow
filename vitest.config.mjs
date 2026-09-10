import path from "node:path";
import { fileURLToPath } from "node:url";

export default {
  resolve: { alias: { "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src") } },
  test: {
    environment: "node",
  },
};
