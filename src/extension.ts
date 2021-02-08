import * as vscode from "vscode";
import sortImports from "import-sort";
import sortStyle from "./sort-style";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const channel = vscode.window.createOutputChannel("vsc-sort-import");
  const disposable = vscode.commands.registerCommand(
    "vsc-sort-import.sort",
    () => {
      try {
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
          return;
        }
        if (!/^(java|type)script(react)?$/.test(document.languageId)) {
          return;
        }
        const res = sortImports(
          document.getText(),
          "import-sort-parser-typescript",
          sortStyle
        );
        if (res.changes.length === 0) {
          // don't modify document if there is no change
          return;
        }
        vscode.window.activeTextEditor.edit((builder) => {
          const all = new vscode.Range(
            0,
            0,
            Number.MAX_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER
          );
          builder.replace(all, res.code);
        });
      } catch (e) {
        // if failed, print error and keep silent
        channel.appendLine(e);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
