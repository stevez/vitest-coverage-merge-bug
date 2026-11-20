// Runs each Vitest project on its own, then all projects together, and flags
// files where the merged report has more statements/functions than either
// project produced alone. Those extra entries are duplicates created when
// istanbul-lib-coverage fails to match the same code across the two transforms.
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const run = (args, dir) => {
  fs.rmSync(dir, { recursive: true, force: true })
  execSync(`npx vitest run ${args} --coverage.reporter=json --coverage.reportsDirectory=${dir}`, { stdio: 'ignore' })
  return JSON.parse(fs.readFileSync(path.join(dir, 'coverage-final.json'), 'utf8'))
}

const unit = run('--project unit', 'coverage/unit')
const browser = run('--project browser', 'coverage/browser')
const merged = run('', 'coverage/merged')

const loc = (l) => `${l.start.line}:${l.start.column}-${l.end.line}:${l.end.column}`
const count = (d, key) => (d ? Object.keys(d[key]).length : 0)
// Read installed versions from disk (some packages don't export package.json).
// istanbul-lib-coverage may be nested under @vitest/coverage-v8.
const pkg = (name) => {
  for (const dir of ['node_modules/@vitest/coverage-v8/node_modules', 'node_modules']) {
    const file = path.join(dir, name, 'package.json')
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8')).version
  }
  return '?'
}

console.log(`vitest ${pkg('vitest')}, vite ${pkg('vite')}, @vitest/istanbul-lib-coverage ${pkg('@vitest/istanbul-lib-coverage')}\n`)

let failures = 0
for (const file of Object.keys(merged).sort()) {
  const name = path.basename(file)
  const rows = [['statements', 'statementMap'], ['functions', 'fnMap']].map(([label, key]) => {
    const expected = Math.max(count(unit[file], key), count(browser[file], key))
    return { label, key, expected, actual: count(merged[file], key) }
  })
  const bad = rows.filter((r) => r.actual > r.expected)
  console.log(`${bad.length ? 'DUPLICATED' : 'ok        '} ${name.padEnd(16)} ${rows.map((r) => `${r.label} ${r.actual} (max per project ${r.expected})`).join(', ')}`)
  for (const r of bad) {
    failures++
    const locs = (d) => new Set(Object.values(d?.[r.key] ?? {}).map((e) => loc(e.loc ?? e)))
    const [u, b] = [locs(unit[file]), locs(browser[file])]
    for (const l of locs(merged[file])) {
      if (!(u.has(l) && b.has(l))) console.log(`             ${r.label.slice(0, -1)} ${l.padEnd(14)} ${u.has(l) ? 'unit only' : 'browser only'}`)
    }
  }
}
process.exitCode = failures ? 1 : 0
