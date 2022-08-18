---
title: Make it Wrong
publishedAt: '2022-07-04'
description: How not to fail at making it fast
by: nate
---

I keep coming back to the mantra "[Make it work, make it right, make it fast](https://wiki.c2.com/?MakeItWorkMakeItRightMakeItFast)" (lets abbreviate that to MW-MR-MF). One of the main pitches of Tamagui is performance, and in building it I've come to a less catchy but truer formulation:

> Never add a feature that can't be fast - but always make it right first.

The basics idea of MW-MR-MF is easy enough. It basically wants to save you a lot of wasted dev time - if you don't get your program right _first_, you'll never know if your performance work is even valid. You'll waste time with regressions and edge cases you never considered, and may even end up at a dead end altogether.

This is true. I know it because I've ended up there. But MW-MR-MF doesn't avoid all dead ends, in fact doing so can lead you to a very different type of dead-end:

**Making it right without performance in mind can make performance impossible**.

## Think it fast first

If you're lucky, making a program fast after you get it right is just a matter of refactoring. But that's not always the case.

Tamagui uses an optimizing compiler to be fast. But it's not my first one. The UI kit I built before Tamagui (that was never released) largely looked and felt like Tamagui, but it ended in disaster.

I followed MW-MR-MF. In fact, the fast part came far into the development of the kit, after quite a few really handy features had made their way in. But the problem was that _because of those features_ **it was impossible to make it fast**.

The problems were numerous, but can be summarized as follows: dynamism that couldn't be captured at compile time.

It was weeks into trying to fix some subtle issues with the compiler that I realized the only way I could fix them (due to the nightmarish _cascading_ part of _Cascading Style Sheets_) was to rewrite the outputted classnames entirely to be [atomic](https://css-tricks.com/lets-define-exactly-atomic-css/).

So, I tried. I had the tests and a large app to run integration on. I mapped out the solution, and I dove in to the refactor.

Nearly a month later, I gave up. Not just on the refactor, but the UI kit itself. It simply couldn't be made fast as it was.

With some "small" changes to the featureset, it would work. But those small changes trickled up to everthing, to the point where it essentially would be a total rewrite.

### Follow the mantra, in smaller steps

After a few months of burn-out, I started back on a new project. I didn't copy a line of code from the old UI kit, despite it being massive and really beautifully made in most areas. I wanted to build a new UI kit for this project, but this time with a different core focus - I wanted it to work on React Native as well as web.

And this time, I knew it needed to be designed for compilation from the start.

I started with the compiler. It evolved alongside the featureset. Every feature needed was first scoped out through the lens of the compiler.

The "right" part _was_ the performance. That's basically true for all libraries that want to be popular. If you're building software without caring about performance, you're failing your users, and someone else won't.

So make it right first with speed in mind. With the smallest surface area possible. Validate at the least _can_ be optimized technically, but ideally just make it fast. Only then, add more features. In other words, it's a loop:

1. Make it (the smallest possible feature) work
2. Make it right
3. Make it fast
4. Return to step 1
