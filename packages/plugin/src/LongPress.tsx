import * as React from 'react';
export class LongPress {
    static optionsMiddleware(options: any) {
        return options;
    }
    
    static componentMiddleware({ Comp, newOptions }: any) {
        return React.forwardRef((props, ref) => {

            const [longPress, setLongPress] = React.useState(false);
            const [longPressTimeout, setLongPressTimeout] = React.useState(null);

            const onMouseDown = React.useCallback((e) => {
                setLongPressTimeout(setTimeout(() => {
                    setLongPress(true);
                }, 500));
            }, []);

            const onMouseUp = React.useCallback((e) => {
                clearTimeout(longPressTimeout);
                setLongPressTimeout(null);
                setLongPress(false);
            }, [longPressTimeout]);

            return (
                <Comp
                    {...props}
                    ref={ref}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    longPress={longPress}
                />
            );
        })
    }
}