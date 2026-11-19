
import * as vscode from "vscode"

function getInput(){
  const editor = vscode.window.activeTextEditor
  if (!editor) return ""

  const selection = editor.selection
  const document = editor.document
  
  if (!selection.isEmpty) {
    return document.getText(selection).trim()
  } else {
    return document.lineAt(selection.active.line).text.trim()
  }
}

async function sendToDebugger() {
  let debugSession = vscode.debug.activeDebugSession
  if(!debugSession) {
    vscode.window.showErrorMessage('No active debug session')
    return
  }

  let input = getInput()
  if(input.length === 0) return

  try {
    await debugSession.customRequest('evaluate', {
      expression: "p " + input,
      context: 'repl'
    })
  } catch (error){
    vscode.debug.activeDebugConsole.appendLine(`${error}`)
  }
}

async function startDebugging(e: vscode.TextDocument) {
  if(e.fileName.endsWith('.quickdebug')){
    let info = JSON.parse(e.getText())
    let tab = vscode.window.tabGroups.activeTabGroup.activeTab
    if(tab) await vscode.window.tabGroups.close(tab, true)
    try {
      await vscode.workspace.fs.delete(e.uri)
    } catch {}

    vscode.debug.startDebugging(undefined, info)
  }
}

function scanTabs() {
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      const input = tab.input
      if (!(input instanceof vscode.TabInputText)) continue
      if (!input.uri.fsPath.endsWith('.quickdebug')) continue
      const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === input.uri.toString())
      if (doc) startDebugging(doc)
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('quickdebug.sendToDebugger', sendToDebugger)
  )

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(startDebugging)
  )

  scanTabs()
}

export function deactivate() {}
