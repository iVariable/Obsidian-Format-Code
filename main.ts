import {Editor, MarkdownView, Notice, Plugin} from 'obsidian';

const prettier = require("prettier");
import * as rustPlugin from "prettier-plugin-rust";

const plugins = [
  require("prettier/parser-babel"),
  require("prettier/parser-html"),
  require("prettier/parser-yaml"),
  require("prettier/parser-graphql"),
  require("prettier/parser-typescript"),
  rustPlugin,
];

interface Formatter {
  name: string;
  parser: string;
}

export default class FormatCodePlugin extends Plugin {
  async onload() {
    let supportedFormats: Formatter[] = [
      {
        name: "JSON",
        parser: "json"
      },
      {
        name: "YAML",
        parser: "yaml"
      },
      {
        name: "HTML",
        parser: "html"
      },
      {
        name: "GraphQL",
        parser: "graphql"
      },
      {
        name: "TypeScript",
        parser: "typescript"
      },
      {
        name: "Rust",
        parser: "jinx-rust"
      }
    ];

    supportedFormats.forEach(x => {
      this.addCommand({
        id: 'format-prettier-' + x.name,
        name: x.name,
        editorCallback: (editor: Editor, view: MarkdownView) => {
          try {
            const formatted = prettier.format(editor.getSelection(), {
              semi: false,
              parser: x.parser,
              plugins: plugins
            });
            editor.replaceSelection(formatted);
          } catch (e) {
            console.log(e);
            new Notice("Format: " + e);
          }
        }
      });
    });
  }
}
