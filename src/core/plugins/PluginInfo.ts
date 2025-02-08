export abstract class PluginInfo {
  abstract id: string;
  abstract version: string;
  abstract name: string;
  abstract description: string;
  abstract authors: string[];
  abstract environment: "javascript" | "typescript" | "any";
  abstract depends: string[];
}
