
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument) => {
      if(e.fileName.endsWith('.quickdebug')){
        let info = JSON.parse(e.getText())
        let tab = vscode.window.tabGroups.activeTabGroup.activeTab
        if(tab) vscode.window.tabGroups.close(tab, true)

        vscode.debug.startDebugging(undefined, info)
      }
    })
  )
}

export function deactivate() {}
