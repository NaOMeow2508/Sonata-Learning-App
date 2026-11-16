const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const root = __dirname;
const url = 'http://127.0.0.1:5180/';
const homepage = url + '#/home';
function isReady() {
  return new Promise(resolve => {
    const request = http.get(url, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {body += chunk;});
      response.on('end', () => resolve(response.statusCode === 200 && (body.includes('Kleine Welten') || body.includes('Sonata'))));
    });
    request.setTimeout(1000, () => request.destroy());
    request.on('error', () => resolve(false));
  });
}
async function main() {
  if (!await isReady()) {
    const vite = path.join(root, 'node_modules/vite/bin/vite.js');
    if (!fs.existsSync(vite)) throw new Error('Project dependencies are missing. Please restore node_modules first.');
    const log = fs.openSync(path.join(root, '.codex-vite.log'), 'a');
    const errors = fs.openSync(path.join(root, '.codex-vite-error.log'), 'a');
    const server = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', '5180', '--strictPort'], {
      cwd: root, detached: true, windowsHide: true, stdio: ['ignore', log, errors],
    });
    server.on('error', error => console.error(error.message));
    server.unref();
    fs.closeSync(log);
    fs.closeSync(errors);
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (await isReady()) {ready = true;break;}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error('Preview did not start. See .codex-vite-error.log. Port 5180 may be in use.');
  }
  const browser = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', "Start-Process 'http://127.0.0.1:5180/#/home'"], {windowsHide:true,stdio:'ignore'});
  browser.on('error', error => console.error(error.message));
  console.log('Preview ready: ' + homepage);
}
main().catch(error => {console.error(error.message);process.exitCode = 1;});
