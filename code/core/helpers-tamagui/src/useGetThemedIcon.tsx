import React from 'react'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (!el) return el

    // ForwardRefExoticComponent (External icons like Iconoir passed as icon={Heart})
    if (el.$$typeof === Symbol.for('react.forward_ref')) {
      return React.createElement(el, { 
        width: props.size, 
        height: props.size,
        color
      });
    }

    // Function/component (e.g., LucideHeart passed as icon={LucideHeart})
    if (typeof el === 'function') {
      const isTamaguiIcon = el.acceptsSize === true;
      
      if (isTamaguiIcon) {
        // Tamagui icon - use size prop
        return React.createElement(el, {
          size: props.size,
          color,
        });
      } else {
        // External icon - use width/height
        return React.createElement(el, { 
          width: props.size, 
          height: props.size,
          color
        });
      }
    }

    // React Element (icon passed as <Icon />)
    if (React.isValidElement(el)) {
      // Check if it's a Tamagui icon
      const isTamaguiIcon = (el.type as any).acceptsSize === true;
      
      if (isTamaguiIcon) {
        // Tamagui icon - use size prop
        return React.cloneElement(el as any, {
          size: props.size,
          color,
          ...(el.props || {}),
        });
      } else {
        // External icon - use width/height
        return React.cloneElement(el as any, {
          width: props.size,
          height: props.size,
          color,
          ...(el.props || {}),
        });
      }
    }
    
    // Fallback for other types
    return React.createElement(el, { 
      width: props.size, 
      height: props.size,
      color
    })
  }
}
