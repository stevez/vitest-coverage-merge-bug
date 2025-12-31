const fs = require('fs');
const data = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

for (const [file, cov] of Object.entries(data)) {
  const shortFile = file.replace(/.*[/\\]/, '');
  console.log('File:', shortFile);
  console.log('  Statements:', Object.keys(cov.statementMap).length);
  for (const [key, loc] of Object.entries(cov.statementMap)) {
    console.log('    [' + key + '] line ' + loc.start.line + ':' + loc.start.column + ' -> ' + loc.end.line + ':' + loc.end.column);
  }
  console.log('');
}
