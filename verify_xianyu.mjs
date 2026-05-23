import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/ss_01_initial.png' });

const logo = await page.locator('text=鱼排版').count();
const editBtn = await page.locator('button:has-text("编辑")').count();
const compareBtn = await page.locator('button:has-text("对比")').count();
const draftsBtn = await page.locator('button:has-text("草稿")').count();
const hwBtn = await page.locator('button').filter({hasText: '抄作业'}).count();
console.log('HEADER logo:', logo, '| edit:', editBtn, '| compare:', compareBtn, '| drafts:', draftsBtn, '| homework:', hwBtn);

const tas = await page.locator('textarea').count();
const previewHeader = await page.locator('text=预览').count();
console.log('DUAL-PANE textarea:', tas, '| preview header:', previewHeader);

const se = await page.locator('button:has-text("iPhone SE")').count();
const std = await page.locator('button:has-text("iPhone 15")').count();
const promax = await page.locator('button:has-text("Pro Max")').count();
const androidBtn = await page.locator('button:has-text("Android")').count();
console.log('DEVICES SE:', se, '| 15:', std, '| ProMax:', promax, '| Android:', androidBtn);

const copyBtns = await page.locator('button:has-text("复制")').count();
console.log('COPY button:', copyBtns);

const ta = page.locator('textarea').first();
await ta.click();
await ta.fill('测试商品名称\n\n商品描述内容\n换行测试\n\n品牌：测试牌');
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/ss_02_typing.png' });
const liveUpdate = await page.locator('text=测试商品名称').count();
console.log('LIVE PREVIEW updates:', liveUpdate);

const emojiToggle = page.locator('button').filter({hasText: '😊'}).first();
await emojiToggle.click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ss_03_emoji_panel.png' });
const panelVisible = await page.locator('text=emoji 面板').count();
const hotTab = await page.locator('button:has-text("热门")').count();
console.log('EMOJI PANEL visible:', panelVisible, '| hot category:', hotTab);
await emojiToggle.click({ force: true }); // panel overlaps toolbar; use force
await page.waitForTimeout(100);

await page.locator('button:has-text("iPhone SE")').first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ss_04_se.png' });
console.log('DEVICE SE clicked');

await page.locator('button:has-text("Android")').first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ss_05_android.png' });
console.log('DEVICE Android clicked');

await page.locator('button:has-text("Pro Max")').first().click();
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/ss_06_promax.png' });
console.log('DEVICE ProMax clicked');

await page.locator('button:has-text("对比")').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/ss_07_compare.png' });
const compareTitle = await page.locator('text=三栏对比').count();
const syncLabel = await page.locator('text=同步滚动').count();
console.log('COMPARE title:', compareTitle, '| sync toggle:', syncLabel);

const compareTAs = page.locator('textarea');
const compareTACount = await compareTAs.count();
console.log('COMPARE textareas:', compareTACount);

if (compareTACount >= 1) await compareTAs.nth(0).fill('版本A文案内容\n\n测试对比功能');
if (compareTACount >= 2) await compareTAs.nth(1).fill('版本B文案内容\n\n更好写法');
if (compareTACount >= 3) await compareTAs.nth(2).fill('版本C文案内容\n\n最优版本');
await page.waitForTimeout(100);

const previewTabs = page.locator('button:has-text("预览")');
const tabCount = await previewTabs.count();
console.log('COMPARE preview tabs:', tabCount);
if (tabCount > 0) {
  await previewTabs.first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/ss_08_compare_preview.png' });
}

const syncCheck = page.locator('input[type="checkbox"]').first();
await syncCheck.click();
await page.waitForTimeout(100);
await syncCheck.click();
console.log('SYNC SCROLL toggle ok');

await page.locator('button:has-text("草稿")').click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/ss_09_drafts.png' });
const draftMgr = await page.locator('text=草稿管理').count();
console.log('DRAFTS manager:', draftMgr);

await page.locator('button:has-text("+ 新草稿")').click();
await page.waitForTimeout(200);
await page.locator('input[placeholder="草稿名称"]').fill('测试草稿甲');
await page.locator('input[placeholder="草稿名称"]').press('Enter');
await page.waitForTimeout(500);
const draftVisible = await page.locator('text=测试草稿甲').count();
console.log('DRAFT created visible:', draftVisible);

await page.locator('button:has-text("+ 新草稿")').click();
await page.waitForTimeout(200);
await page.locator('input[placeholder="草稿名称"]').fill('测试草稿乙');
await page.locator('input[placeholder="草稿名称"]').press('Enter');
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/ss_10_two_drafts.png' });
const twoVisible = await page.locator('text=测试草稿').count();
console.log('TWO DRAFTS visible:', twoVisible);

await page.locator('button:has-text("编辑")').click();
await page.waitForTimeout(200);
await page.locator('button').filter({hasText: '抄作业'}).click();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/ss_11_homework_modal.png' });
const modalTitle = await page.locator('text=抄作业模式').count();
console.log('COPY HOMEWORK modal:', modalTitle);

const extractDisabled = await page.locator('button:has-text("提取结构")').isDisabled();
console.log('EXTRACT disabled when empty:', extractDisabled);

const hwInput = page.locator('textarea').first();
await hwInput.fill('Apple AirPods Pro 二代\n\n99新\n\n品牌：Apple\n型号：Pro 2\n成色：99成新\n\n出售原因：换新款\n\n顺丰包邮');
await page.waitForTimeout(100);

await page.locator('button:has-text("提取结构")').click();
await page.waitForTimeout(400);
const outputTA = page.locator('textarea').nth(1);
const outputVal = await outputTA.inputValue();
console.log('EXTRACT output length:', outputVal.length);
await page.screenshot({ path: '/tmp/ss_12_extracted.png' });

const useBtn = page.locator('button:has-text("使用此模板")');
const useBtnDisabled = await useBtn.isDisabled();
console.log('USE TEMPLATE disabled:', useBtnDisabled);
await useBtn.click();
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/ss_13_after_template.png' });
const editorVal = await page.locator('textarea').first().inputValue();
console.log('EDITOR content after template len:', editorVal.length);

await browser.close();
console.log('\nCONSOLE ERRORS:', errors.length > 0 ? errors.join('\n') : 'none');
