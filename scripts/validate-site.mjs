import fs from 'node:fs';
const required=['dist/index.html','dist/styles.css','dist/app.js','dist/content.md'];
for(const file of required)if(!fs.existsSync(file))throw new Error(`Missing ${file}`);
const html=fs.readFileSync('dist/index.html','utf8'),css=fs.readFileSync('dist/styles.css','utf8'),js=fs.readFileSync('dist/app.js','utf8'),content=fs.readFileSync('dist/content.md','utf8');
for(const ref of ['./styles.css','./app.js'])if(!html.includes(ref))throw new Error(`Missing HTML reference ${ref}`);
for(let i=1;i<=18;i++)if(!content.includes(`## ${i}.`))throw new Error(`Content section ${i} is missing`);
if(!css.includes('@media(max-width:620px)'))throw new Error('Mobile styles are missing');
new Function(js);
console.log(`Validated ${required.length} site files, all 18 source sections, responsive styles, and JavaScript syntax.`);
