import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Free AI Tools extension is now active!');

    const provider = new FreeAIToolsViewProvider(context.extensionUri, context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(FreeAIToolsViewProvider.viewType, provider)
    );

    // Add a command to open in a new tab if necessary
    context.subscriptions.push(vscode.commands.registerCommand('extension.openFreeAITools', () => {
        // This can open your webview in a new tab if you want to keep this functionality
        // In this case, the main view will be in the sidebar
    }));
}

class FreeAIToolsViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'freeAIToolsView';

    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _context: vscode.ExtensionContext
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'src', 'resources')
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'openInternal':
                    // Открываем внутри VSCode используя Webview Panel
                    this.openInWebview(message.url);
                    break;
                case 'openExternal':
                    // Открываем в системном браузере
                    vscode.env.openExternal(vscode.Uri.parse(message.url));
                    break;
                case 'openLink':
                    // Для совместимости - открываем в системном браузере
                    vscode.env.openExternal(vscode.Uri.parse(message.url));
                    break;
                case 'restartExtension':
                    // Перезагружаем web-view, чтобы применить новый язык
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                    // if (this._view) {
                    // this._view.webview.html = this._getHtmlForWebview(this._view.webview);
                    // }
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        try {
            const resourceRoot = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'resources'));
            const popupHtmlPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'resources', 'popup.html');
            const popupJsPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'resources', 'popup.js');
            const styleCssPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'resources', 'style.css');
            const newYearCssPath = vscode.Uri.joinPath(this._extensionUri, 'src', 'resources', 'NewYearTheme.css');

            if (!fs.existsSync(popupHtmlPath.fsPath)) {
                return getErrorPage(new Error(`File not found: ${popupHtmlPath.fsPath}`));
            }

            const popupHtml = fs.readFileSync(popupHtmlPath.fsPath, 'utf8');
            const popupJs = adaptJavaScriptForVSCode(fs.readFileSync(popupJsPath.fsPath, 'utf8'));
            const styleCss = fs.readFileSync(styleCssPath.fsPath, 'utf8');
            const newYearCss = fs.readFileSync(newYearCssPath.fsPath, 'utf8');

            return popupHtml.replace(/(href|src)="([^"]+)"/g, `$1="${resourceRoot}/$2"`)
                            .replace('</head>', `<style>${styleCss}\n${newYearCss}</style></head>`)
                            .replace('</body>', `<script>\n(function() {\nconst vscode = acquireVsCodeApi();\n${popupJs.replace(/window.open/g, 'vscode.postMessage')}\n})();\n</script></body>`);
        } catch (error) {
            return getErrorPage(error);
        }
    }

    private openInWebview(url: string) {
        // Создаем новую панель webview для открытия ссылки
        const panel = vscode.window.createWebviewPanel(
            'aiToolWebview',
            'AI Tool',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        // Получаем домен из URL для заголовка
        const domain = this.getDomainFromUrl(url);
        panel.title = domain || 'AI Tool';

        // Создаем HTML для iframe
        panel.webview.html = this.getWebviewContent(url);
        
        // Обработчик сообщений от WebView панели
        panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'openExternal') {
                vscode.env.openExternal(vscode.Uri.parse(message.url));
            }
        });
    }

    private getDomainFromUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return 'AI Tool';
        }
    }

    private getWebviewContent(url: string): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Tool</title>
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                    font-family: 'Segoe UI', sans-serif;
                }
                iframe {
                    width: 100%;
                    height: 100vh;
                    border: none;
                    display: none;
                }
                .loading {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    z-index: 1000;
                }
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007ACC;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .error {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    background: #f8f8f8;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    z-index: 1001;
                }
                .error h3 {
                    color: #d73a49;
                    margin-top: 0;
                }
                .open-external {
                    background: #007ACC;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .open-external:hover {
                    background: #005a9e;
                }
            </style>
        </head>
        <body>
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <div>Loading ${url}...</div>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">This may take a moment...</div>
            </div>
            
            <div class="error" id="error">
                <h3>⚠️ Unable to load in VSCode</h3>
                <p>This website cannot be displayed in an iframe due to security restrictions.</p>
                <button class="open-external" onclick="openExternal()">Open in Browser</button>
            </div>
            
            <iframe id="iframe" src="${url}" frameborder="0" allowfullscreen></iframe>
            
            <script>
                const iframe = document.getElementById('iframe');
                const loading = document.getElementById('loading');
                const error = document.getElementById('error');
                
                let loadTimeout;
                
                // Таймаут для загрузки (10 секунд)
                loadTimeout = setTimeout(() => {
                    loading.style.display = 'none';
                    error.style.display = 'block';
                }, 10000);
                
                let loaded = false;
                
                iframe.onload = function() {
                    loaded = true;
                    clearTimeout(loadTimeout);
                    loading.style.display = 'none';
                    iframe.style.display = 'block';
                };
                
                iframe.onerror = function() {
                    clearTimeout(loadTimeout);
                    loading.style.display = 'none';
                    error.style.display = 'block';
                };
                
                // Дополнительная проверка видимости iframe через 3 секунды
                setTimeout(() => {
                    if (!loaded) {
                        // Проверяем, отображается ли iframe визуально
                        const iframeRect = iframe.getBoundingClientRect();
                        const iframeVisible = iframeRect.width > 0 && iframeRect.height > 0;
                        
                        if (iframeVisible) {
                            // Iframe отображается, считаем загрузку успешной
                            loaded = true;
                            clearTimeout(loadTimeout);
                            loading.style.display = 'none';
                            iframe.style.display = 'block';
                        }
                    }
                }, 3000);
                
                function openExternal() {
                    // Отправляем сообщение в VSCode для открытия в браузере
                    if (window.acquireVsCodeApi) {
                        const vscode = window.acquireVsCodeApi();
                        vscode.postMessage({command: 'openExternal', url: '${url}'});
                    } else {
                        window.open('${url}', '_blank');
                    }
                }
            </script>
        </body>
        </html>`;
    }
}

function adaptJavaScriptForVSCode(js: string): string {
  // Заменяем chrome.runtime на заглушку для VSCode
  js = js.replace(/chrome\.runtime\.getManifest\(\)\.version/g, '"1.0.0"');
  
  // Заменяем window.open на vscode.postMessage для открытия ссылок
  js = js.replace(/window\.open\(([^,]+),\s*['\"]_blank['\"]\)/g, 'vscode.postMessage({command: "openLink", url: $1})');
  
  // Удаляем fetch запросы для обновлений (они не работают в VSCode webview)
  js = js.replace(/async function checkForUpdates\(\)[\s\S]*?\}/g, 'function checkForUpdates() { /* disabled in VSCode */ }');
  
  // Заменяем httpGet на заглушку (для переводов)
  js = js.replace(/function httpGet\([^}]*\}[^}]*\}/g, 'function httpGet(url) { return "[Translation not available in VSCode]"; }');
  
  // Добавляем обработку сообщений для VSCode
  const vscodeHandler = `
  // VSCode integration
  const vscode = acquireVsCodeApi();
  
  // Переопределяем window.open для случаев, которые не были заменены
  window.open = function(url, target) {
    if (url && url.startsWith('http')) {
      vscode.postMessage({command: 'openExternal', url: url});
    }
  };
  `;
  
  return vscodeHandler + js;
}

function getErrorPage(error: any): string {
  return `<!DOCTYPE html>
  <html>
  <head>
      <title>Error</title>
      <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
          .error { color: #f44336; }
      </style>
  </head>
  <body>
      <h1>Error Loading Free AI Tools</h1>
      <p class="error">Error: ${error.message}</p>
      <p>Please check if the 'here' folder exists and contains the required files.</p>
  </body>
  </html>`;
}

export function deactivate() {}
