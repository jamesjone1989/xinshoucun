import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'exports', 'mobile');
const assets = path.join(root, 'assets');
const sourceBooks = '/Users/jiangzhichao/Documents/火柴人-知识卡片/outputs/AI新手村-知识卡片宣传图';
const W = 1080;
const H = 1920;
const execFileAsync = promisify(execFile);
const regular = await fs.readFile(path.join(assets, 'OPPOSans-Regular.ttf')).then((v) => v.toString('base64'));
const heavy = await fs.readFile(path.join(assets, 'OPPOSans-Heavy.ttf')).then((v) => v.toString('base64'));

function xml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
}

function base({ bg = '#f7f5ef', content, number, dark = false }) {
  const header = dark ? '#ffffff' : '#141616';
  const muted = dark ? '#d8f479' : '#616663';
  return `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><style>
        @font-face { font-family: OPPO; src: url(data:font/ttf;base64,${regular}) format('truetype'); font-weight: 400 600; }
        @font-face { font-family: OPPO; src: url(data:font/ttf;base64,${heavy}) format('truetype'); font-weight: 700 900; }
        .small { font-family: OPPO, sans-serif; font-size: 27px; font-weight: 600; letter-spacing: 2px; }
        .body { font-family: OPPO, sans-serif; font-size: 37px; font-weight: 500; }
        .title { font-family: OPPO, sans-serif; font-size: 98px; font-weight: 900; letter-spacing: -5px; }
        .big { font-family: OPPO, sans-serif; font-size: 124px; font-weight: 900; letter-spacing: -7px; }
        .cardtitle { font-family: OPPO, sans-serif; font-size: 43px; font-weight: 900; letter-spacing: -2px; }
      </style></defs>
      <rect width="${W}" height="${H}" fill="${bg}"/>
      <line x1="54" x2="1026" y1="69" y2="69" stroke="${header}" stroke-width="3"/>
      <rect x="54" y="95" width="50" height="50" fill="#141616"/>
      <text x="79" y="130" text-anchor="middle" fill="#d8f479" class="small" style="font-size:20px;letter-spacing:0">AI</text>
      <text x="122" y="129" fill="${header}" class="small" style="font-size:26px;letter-spacing:0">新手村</text>
      <text x="1026" y="129" text-anchor="end" fill="${muted}" class="small" style="font-size:20px">${xml(number)}</text>
      ${content}
    </svg>`;
}

function textLines(lines, x, y, className, color = '#141616', gap = 116) {
  return lines.map((line, index) => `<text x="${x}" y="${y + index * gap}" class="${className}" fill="${color}">${xml(line)}</text>`).join('');
}

async function image(input) {
  return `data:image/png;base64,${(await fs.readFile(input)).toString('base64')}`;
}

async function exportPoster(name, svg, layers = []) {
  const placed = layers.map(({ input, left, top, width, height }) => `<image href="${input}" x="${left}" y="${top}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/>`).join('');
  const temp = path.join(output, `.${name}.svg`);
  await fs.writeFile(temp, svg.replace('</svg>', `${placed}</svg>`));
  await execFileAsync('sips', ['-s', 'format', 'png', temp, '--out', path.join(output, name)]);
  await fs.rm(temp);
}

await fs.mkdir(output, { recursive: true });

const cutout = await image(path.join(assets, 'xigua-teacher-cutout.png'));
await exportPoster('01-AI新手村-封面.png', base({ number: '01 / 06', bg: '#ff5c46', content: `
  <circle cx="360" cy="950" r="342" fill="#82cf39"/><circle cx="416" cy="998" r="342" fill="#d94839" opacity=".52"/>
  ${textLines(['AI新手村'], 470, 480, 'big', '#ffffff', 0)}
  ${textLines(['用 AI，做成一件事。'], 470, 625, 'cardtitle', '#d8f479', 0)}
  ${textLines(['和 3000+ 朋友一起，', '用 AI 提升办公效率。'], 470, 730, 'body', '#ffffff', 56)}
  <line x1="470" y1="875" x2="980" y2="875" stroke="#ffffff" stroke-opacity=".7" stroke-width="2"/>
  <text x="470" y="950" class="small" fill="#ffffff">3000+　一起实践</text>
  <text x="470" y="1005" class="small" fill="#ffffff">办公　效率提升</text>
  <rect x="470" y="1110" width="430" height="90" rx="45" fill="#141616"/>
  <text x="685" y="1167" text-anchor="middle" class="small" fill="#d8f479" style="font-size:29px;letter-spacing:0">从一件具体工作开始</text>
  <text x="54" y="1746" class="small" fill="#ffffff">AI NEWBIE VILLAGE / OFFICE PRACTICE</text>
  <text x="54" y="1813" class="body" fill="#ffffff">写材料 · 做 PPT · 处理表格</text>
` }), [{ input: cutout, left: 52, top: 840, width: 590, height: 1020 }]);

await exportPoster('02-痛点与解法.png', base({ number: '02 / 06', content: `
  <text x="54" y="282" class="small" fill="#616663">02 / 痛点</text>
  ${textLines(['知道不少工具，', '却还没做成一件事。'], 54, 430, 'title', '#141616', 112)}
  ${textLines(['教程越存越多，真正要写材料、做汇报、处理表格时，', '还是不知道从哪里开始。'], 54, 700, 'body', '#141616', 55)}
  <rect x="54" y="825" width="972" height="228" fill="#d8f479"/>
  <text x="86" y="894" class="small" fill="#141616">01 / 看完就忘</text>
  <text x="86" y="970" class="cardtitle" fill="#141616">工具一直在变，学不过来。</text>
  <rect x="54" y="1072" width="972" height="228" fill="#ff5c46"/>
  <text x="86" y="1141" class="small" fill="#141616">02 / 不知道怎么用</text>
  <text x="86" y="1217" class="cardtitle" fill="#141616">会聊天，但不会做事。</text>
  <rect x="54" y="1319" width="972" height="228" fill="#9ce0c0"/>
  <text x="86" y="1388" class="small" fill="#141616">03 / 一个人卡住</text>
  <text x="86" y="1464" class="cardtitle" fill="#141616">没有反馈，也没有同行者。</text>
  <rect x="0" y="1624" width="1080" height="296" fill="#141616"/>
  <text x="54" y="1716" class="small" fill="#d8f479">03 / 这里有解法</text>
  ${textLines(['从一件具体工作开始。'], 54, 1832, 'title', '#ffffff', 0)}
` }));

const courseMap = await image(path.join(assets, 'ai-newbie-course-map.png'));
await exportPoster('03-新手课程.png', base({ number: '03 / 06', content: `
  <text x="54" y="270" class="small" fill="#616663">NEWBIE COURSE / 6 组上手场景</text>
  <text x="54" y="325" class="body" fill="#141616">从一件具体工作开始，找到你的上手场景。</text>
  <rect x="54" y="365" width="972" height="3" fill="#141616"/>
  <rect x="54" y="408" width="972" height="1400" fill="#ffffff" stroke="#141616" stroke-width="2"/>
  <text x="540" y="1852" class="small" text-anchor="middle" fill="#616663">写材料 · 做 PPT · 处理表格 · 建知识库 · 做网页</text>
` }), [{ input: courseMap, left: 85, top: 418, width: 910, height: 1380 }]);

const caseMap = await image(path.join(assets, 'ai-real-case-map.png'));
await exportPoster('04-真实案例.png', base({ number: '04 / 06', content: `
  <text x="54" y="270" class="small" fill="#616663">REAL CASES / 60+ 真实实操</text>
  <text x="54" y="325" class="body" fill="#141616">真实场景，真实经验，真实分享。</text>
  <rect x="54" y="365" width="972" height="3" fill="#141616"/>
  <rect x="54" y="408" width="972" height="1400" fill="#ffffff" stroke="#ff5c46" stroke-width="5"/>
  <text x="540" y="1852" class="small" text-anchor="middle" fill="#616663">职场提效 · 知识管理 · 创意内容 · 家庭生活 · 个人成长</text>
` }), [{ input: caseMap, left: 85, top: 418, width: 910, height: 1380 }]);

const books = [
  'AI新手村优秀案例-2026.07.13-2026.07.19-Imagen书本样机宣传图-A4.png',
  'AI实干家的14个共性-Imagen参考风格书本样机宣传图-A4.png',
  'ChatGPT图片提示词库-科技书本样机宣传图-A4-改口号.png',
  'HR AI落地-Imagen参考风格书本样机宣传图-A4.png',
  'AI新手村优秀案例-暖沙咖色书本样机宣传图-A4.png',
  'AI新手村优秀案例-Imagen参考风格书本样机宣传图-A4-v2.png'
];
const bookLayers = await Promise.all(books.map(async (book, index) => ({
  input: await image(path.join(sourceBooks, book)),
  left: 95 + (index % 3) * 320,
  top: 770 + Math.floor(index / 3) * 490,
  width: 250,
  height: 355
})));
await exportPoster('05-资料与手册.png', base({ number: '05 / 06', bg: '#ece7da', content: `
  <text x="54" y="270" class="small" fill="#616663">TAKE AWAY / 只是其中的一点点</text>
  ${textLines(['这只是其中的一点点。', '更多成果，持续更新。'], 54, 405, 'title', '#141616', 108)}
  ${textLines(['案例、手册、提示词库，', '在需要时让你立刻开始。'], 54, 665, 'body', '#141616', 55)}
  <line x1="54" x2="1026" y1="735" y2="735" stroke="#141616" stroke-width="3"/>
  <rect x="54" y="1660" width="508" height="78" fill="#ff5c46" transform="rotate(-2 54 1660)"/>
  <text x="78" y="1712" class="small" fill="#141616" style="font-size:25px;letter-spacing:0">资料、案例、手册，还在持续增加</text>
  <text x="54" y="1828" class="body" fill="#141616">不是抽象的“资料包”，是看得见、用得上的成果。</text>
` }), bookLayers);

await exportPoster('06-加入新手村.png', base({ number: '06 / 06', bg: '#141616', dark: true, content: `
  <circle cx="870" cy="345" r="250" fill="#d8f479"/><circle cx="960" cy="460" r="250" fill="#ff5c46" opacity=".9"/>
  <text x="54" y="310" class="small" fill="#d8f479">06 / 现在开始</text>
  ${textLines(['一个不会催你焦虑，', '但会推你往前走的村落。'], 54, 470, 'title', '#ffffff', 108)}
  ${textLines(['用一顿饭的钱，', '开始把一件事做成。'], 54, 795, 'title', '#d8f479', 108)}
  <line x1="54" x2="1026" y1="1080" y2="1080" stroke="#ffffff" stroke-opacity=".45" stroke-width="2"/>
  <text x="54" y="1170" class="cardtitle" fill="#ffffff">从一件具体工作开始</text>
  <text x="54" y="1240" class="body" fill="#ffffff">看得懂、照着做的真实案例</text>
  <text x="54" y="1310" class="body" fill="#ffffff">系统课程与持续更新的资料</text>
  <text x="54" y="1380" class="body" fill="#ffffff">和 3000+ 朋友一起实践</text>
  <rect x="54" y="1530" width="972" height="156" rx="78" fill="#d8f479"/>
  <text x="540" y="1628" text-anchor="middle" class="title" style="font-size:60px;letter-spacing:-3px" fill="#141616">进入星球  ↗</text>
  <text x="54" y="1810" class="small" fill="#ffffff">AI NEWBIE VILLAGE / OFFICE PRACTICE</text>
` }));

console.log(`Created 6 mobile posters in ${output}`);
