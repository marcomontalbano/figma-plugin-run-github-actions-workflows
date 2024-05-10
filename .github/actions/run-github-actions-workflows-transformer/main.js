// @ts-check

const cp = require('child_process')
cp.execSync(`cd ${__dirname}; npm ci`)

const core = require('@actions/core')

const fileKey = core.getInput('fileKey', { required: true })

/** @type {{ id: string; name: string }} */
const page = JSON.parse(core.getInput('page', { required: true }) || '{}')

/** @type {{ id: string; name: string }[]} */
const selection = JSON.parse(core.getInput('selection', { required: false }) || '[]')

const selectionIds = selection.map(node => node.id)
const pageIds = page.id ? [page.id] : []
const ids = selectionIds.length > 0 ? selectionIds : pageIds

core.startGroup('Outputs')
core.info(`fileKey: ${fileKey}`)
core.info(`ids: ${JSON.stringify(ids)}`)
core.endGroup()

core.setOutput('fileKey', fileKey)
core.setOutput('ids', ids)
