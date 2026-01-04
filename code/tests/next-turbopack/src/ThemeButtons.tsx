'use client';
import "./_ThemeButtons.css"

const _cn5 = "font_body _ff-f-family _dsp-inline _bxs-border-box _ww-break-word _ws-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-color10 ";
const _cn4 = "font_body _ff-f-family _dsp-inline _bxs-border-box _ww-break-word _ws-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-white ";
const _cn3 = "font_body _ff-f-family _dsp-inline _bxs-border-box _ww-break-word _ws-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-white ";
const _cn2 = "font_body _ff-f-family _dsp-inline _bxs-border-box _ww-break-word _ws-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-white ";
const _cn = "font_body _ff-f-family _dsp-inline _bxs-border-box _ww-break-word _ws-pre-wrap _mt-0px _mr-0px _mb-0px _ml-0px _col-white ";
import { Stack, Text, styled } from '@tamagui/core';
import { useThemeSetting } from '@tamagui/next-theme';
import { useEffect, useState } from 'react';
const XStack = styled(Stack, {
  flexDirection: 'row'
});
const Button = styled(Stack, {
  tag: 'button',
  padding: '$3',
  backgroundColor: '$blue10',
  borderRadius: '$4',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.8
  }
});
export function ThemeButtons() {
  const themeSetting = useThemeSetting();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return <>
      <XStack gap="$2">
        <Button onPress={() => themeSetting.set('light')}>
          <span className={_cn}>Light</span>
        </Button>
        <Button onPress={() => themeSetting.set('dark')}>
          <span className={_cn2}>Dark</span>
        </Button>
        <Button onPress={() => themeSetting.set('system')}>
          <span className={_cn3}>System</span>
        </Button>
        <Button onPress={() => themeSetting.toggle?.()}>
          <span className={_cn4}>Toggle Theme</span>
        </Button>
      </XStack>
      <span className={_cn5}>Current theme: {mounted ? themeSetting.current : ''}</span>
    </>;
}