/**
 * Script to reproduce the tooltip position jump bug on tamagui.dev
 *
 * The bug: hover on rightmost button, wait for tooltip to appear,
 * then move FAST across to the left - hitting middle button briefly (1-4 frames)
 * then immediately hitting left button triggers a HUGE jump (hundreds of pixels)
 */

import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({
    headless: false, // non-headless to see devtools
    slowMo: 0,
    args: ['--disable-web-security', '--window-position=2000,0'] // position off main screen
  })

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  })

  const page = await context.newPage()

  // capture ALL console logs to see motion debug output
  page.on('console', msg => {
    const text = msg.text()
    // log everything relevant
    if (text.includes('MOTION') || text.includes('JUMP') || text.includes('[motion]') || text.includes('Transform') || text.includes('WARNING') || text.includes('Computed') || text.includes('Parent')) {
      console.log(`[BROWSER ${msg.type()}] ${text}`)
    }
  })

  // use kitchen-sink test case which picks up motion driver changes faster
  const useKitchenSink = process.argv.includes('--kitchen-sink')

  if (useKitchenSink) {
    console.log('Loading kitchen-sink test case on localhost:9000 with motion driver...')
    await page.goto('http://localhost:9000/?test=TooltipPositionJumpCase&animationDriver=motion', { waitUntil: 'networkidle' })
  } else {
    console.log('Loading localhost:8282...')
    await page.goto('http://localhost:8282', { waitUntil: 'networkidle' })
  }
  await page.waitForTimeout(500)

  // find all 3 buttons - names differ between kitchen-sink and tamagui.dev
  let btn1, btn2, btn3: any
  if (useKitchenSink) {
    btn1 = page.getByTestId('tooltip-jump-trigger-1')
    btn2 = page.getByTestId('tooltip-jump-trigger-2')
    btn3 = page.getByTestId('tooltip-jump-trigger-3')
    await btn1.waitFor({ timeout: 10000 })
  } else {
    // tamagui.dev button texts (PromoLinksRow): 'Starter Kit', 'Copy-Paste UI', 'Hire Us!'
    btn1 = page.getByText('Starter Kit').first()
    btn2 = page.getByText('Copy-Paste UI').first()
    btn3 = page.getByText('Hire Us!').first()
    await btn1.waitFor({ timeout: 10000 })
  }

  const box1 = await btn1.boundingBox()
  const box2 = await btn2.boundingBox()
  const box3 = await btn3.boundingBox()

  if (!box1 || !box2 || !box3) {
    console.error('Could not find buttons')
    console.log('Page content around buttons:')
    const buttons = await page.locator('button').all()
    for (const btn of buttons.slice(0, 10)) {
      console.log('  Button:', await btn.textContent())
    }
    await browser.close()
    return
  }

  console.log('Found buttons:')
  console.log('  Button 1 (left):', box1.x)
  console.log('  Button 2 (middle):', box2.x)
  console.log('  Button 3 (right):', box3.x)

  // aliases for clarity
  const takeoutBtn = btn1, bentoBtn = btn2, hireBtn = btn3
  const takeoutBox = box1, bentoBox = box2, hireBox = box3

  // inject position tracker - detect jumps and log transform details
  await page.evaluate(`
    (function() {
      window.__jumpLog = [];
      window.__posLog = [];
      var lastPos = null;
      var lastTransform = null;

      function checkForJumps() {
        // Find the tooltip content frame
        var tooltipFrames = document.querySelectorAll('[data-placement]');
        if (tooltipFrames.length > 1) {
          console.log('WARNING: Multiple tooltips found:', tooltipFrames.length);
        }
        var tooltipFrame = tooltipFrames[0];
        if (!tooltipFrame) {
          lastPos = null;
          lastTransform = null;
          requestAnimationFrame(checkForJumps);
          return;
        }

        // The actual animated element is the PARENT of [data-placement]
        // TamaguiView (animated with x/y) -> PopperContentFrame (has data-placement)
        var tooltip = tooltipFrame.parentElement;
        if (!tooltip) {
          tooltip = tooltipFrame; // fallback
        }

        var rect = tooltip.getBoundingClientRect();
        var x = rect.left;
        var y = rect.top;
        var cs = getComputedStyle(tooltip);
        var transform = cs.transform;
        var left = cs.left;
        var top = cs.top;
        var translateX = cs.getPropertyValue('--translateX') || 'N/A';

        window.__posLog.push({ x: x, y: y, transform: transform, t: Date.now() });
        if (window.__posLog.length > 100) window.__posLog.shift();

        if (lastPos) {
          var dx = Math.abs(x - lastPos.x);
          var dy = Math.abs(y - lastPos.y);

          // detect HUGE jumps - the bug causes 400+ pixel jumps
          if (dx > 400 || dy > 400) {
            var msg = 'BIG JUMP! (' + lastPos.x.toFixed(0) + ',' + lastPos.y.toFixed(0) + ') -> (' + x.toFixed(0) + ',' + y.toFixed(0) + ') delta:(' + dx.toFixed(0) + ',' + dy.toFixed(0) + ')';
            window.__jumpLog.push(msg);
            console.log('%c' + msg, 'color: red; font-weight: bold; font-size: 20px');
            console.log('Transform before:', lastTransform);
            console.log('Transform after:', transform);
            console.log('Computed left/top after:', left, top);
            console.log('Parent position:', tooltip.parentElement ? tooltip.parentElement.getBoundingClientRect().left + ',' + tooltip.parentElement.getBoundingClientRect().top : 'N/A');
          }
        }

        lastPos = { x: x, y: y };
        lastTransform = transform;
        requestAnimationFrame(checkForJumps);
      }

      requestAnimationFrame(checkForJumps);
    })();
  `)

  console.log('\n--- Reproducing tooltip jump bug ---\n')
  console.log('Pattern: hover HIRE US (right), wait 1s, then FAST move to TAKEOUT (left)')
  console.log('Key: briefly hitting BENTO in the middle triggers the bug\n')

  const rightX = hireBox.x + hireBox.width / 2
  const middleX = bentoBox.x + bentoBox.width / 2
  const leftX = takeoutBox.x + takeoutBox.width / 2
  const y = hireBox.y + hireBox.height / 2

  // helper to trigger proper mouse events via JS on an element by text
  async function triggerMouseEnterByText(text: string) {
    await page.evaluate((searchText) => {
      // find button containing this text
      const buttons = Array.from(document.querySelectorAll('button'))
      const el = buttons.find(b => b.textContent?.includes(searchText))
      if (!el) {
        console.log('Could not find button with text:', searchText)
        return
      }
      const rect = el.getBoundingClientRect()
      const event = new PointerEvent('pointerenter', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        pointerType: 'mouse'
      })
      el.dispatchEvent(event)

      const mouseEvent = new MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      })
      el.dispatchEvent(mouseEvent)
    }, text)
  }

  // try different timings - only need a few attempts, 35ms worked before
  for (let attempt = 1; attempt <= 3; attempt++) {
    const middleDelay = 25 + (attempt * 10) // try 35ms, 45ms, 55ms

    console.log(`\nAttempt ${attempt} (middle delay: ${middleDelay}ms):`)

    // move away first - trigger mouseleave
    await page.mouse.move(600, 400)
    await page.waitForTimeout(400)

    // step 1: hover on rightmost button - try both native and JS events
    console.log('  Hovering rightmost button...')
    await hireBtn.hover({ force: true, timeout: 1000 })

    // also dispatch events manually to ensure tooltip triggers
    await triggerMouseEnterByText(useKitchenSink ? 'HIRE' : 'Hire Us!')
    await page.waitForTimeout(1200)

    // check if tooltip appeared
    const tooltipVisible = await page.locator('[data-placement]').isVisible().catch(() => false)
    console.log(`  Tooltip visible: ${tooltipVisible}`)

    if (!tooltipVisible) {
      console.log('  Skipping - tooltip not opening')
      continue
    }

    // step 2: FAST move - use native hover which properly triggers enter/leave
    console.log('  Fast move: HIRE -> BENTO -> TAKEOUT')
    await bentoBtn.hover({ force: true, timeout: 100 })
    await page.waitForTimeout(middleDelay)
    await takeoutBtn.hover({ force: true, timeout: 100 })

    await page.waitForTimeout(400)

    // check for jumps
    const jumpCount = await page.evaluate(() => (window as any).__jumpLog?.length || 0)
    if (jumpCount > 0) {
      const jumps = await page.evaluate(() => (window as any).__jumpLog || [])
      console.log(`  FOUND ${jumpCount} JUMP(S)!`)
      jumps.forEach((j: string) => console.log('    ' + j))
      break
    } else {
      console.log('  No jump detected')
    }
  }

  await browser.close()
  console.log('\nDone.')
}

main().catch(console.error)
