const cp = require('child_process');
cp.execSync(`cd ${__dirname}; npm ci`);

const core = require('@actions/core');

const fileKey = core.getInput('fileKey', { required: true });
const pageName = core.getInput('pageName', { required: true });
const selection = JSON.parse(core.getInput('selection', { required: false }) || '[]');

function run() {
  core.setOutput('fileKey', fileKey);
  core.setOutput('pageName', [pageName]);
  core.setOutput('selection', selection.map(sel => sel.id));
}

run();
