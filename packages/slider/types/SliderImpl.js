System.register(["react/jsx-runtime", "@tamagui/constants", "@tamagui/core", "@tamagui/get-token", "@tamagui/helpers", "@tamagui/stacks", "react", "./constants"], function (exports_1, context_1) {
    "use strict";
    var jsx_runtime_1, constants_1, core_1, get_token_1, helpers_1, stacks_1, React, constants_2, SliderFrame, SliderImpl;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (jsx_runtime_1_1) {
                jsx_runtime_1 = jsx_runtime_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (get_token_1_1) {
                get_token_1 = get_token_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            },
            function (stacks_1_1) {
                stacks_1 = stacks_1_1;
            },
            function (React_1) {
                React = React_1;
            },
            function (constants_2_1) {
                constants_2 = constants_2_1;
            }
        ],
        execute: function () {
            exports_1("SliderFrame", SliderFrame = core_1.styled(stacks_1.YStack, {
                position: 'relative',
                variants: {
                    orientation: {
                        horizontal: {},
                        vertical: {},
                    },
                    size: (val, extras) => {
                        if (!val) {
                            return;
                        }
                        const orientation = extras.props['orientation'];
                        const size = Math.round(core_1.getVariableValue(get_token_1.getSize(val)) / 6);
                        if (orientation === 'horizontal') {
                            return {
                                height: size,
                                borderRadius: size,
                                justifyContent: 'center',
                            };
                        }
                        return {
                            width: size,
                            borderRadius: size,
                            alignItems: 'center',
                        };
                    },
                },
            }));
            // export const SliderTrackFrame = styled(SliderFrame, {
            //   // name: 'SliderTrack',
            //   variants: {
            //     unstyled: {
            //       false: {
            //         height: '100%',
            //         width: '100%',
            //         backgroundColor: '$background',
            //         position: 'relative',
            //         borderRadius: 100_000,
            //         overflow: 'hidden',
            //       },
            //     },
            //   } as const,
            //   // defaultVariants: {
            //   //   unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
            //   // },
            // })
            // const XXXX = <SliderFrame margin={10} />
            // const XX = <SliderTrackFrame  />
            exports_1("SliderImpl", SliderImpl = React.forwardRef((props, forwardedRef) => {
                const { __scopeSlider, onSlideStart, onSlideMove, onSlideEnd, onHomeKeyDown, onEndKeyDown, onStepKeyDown, ...sliderProps } = props;
                const context = constants_2.useSliderContext(constants_2.SLIDER_NAME, __scopeSlider);
                return (_jsx(SliderFrame, { size: "$4", ...sliderProps, "data-orientation": sliderProps.orientation, ref: forwardedRef, ...(constants_1.isWeb && {
                        onKeyDown: (event) => {
                            if (event.key === 'Home') {
                                onHomeKeyDown(event);
                                // Prevent scrolling to page start
                                event.preventDefault();
                            }
                            else if (event.key === 'End') {
                                onEndKeyDown(event);
                                // Prevent scrolling to page end
                                event.preventDefault();
                            }
                            else if (constants_2.PAGE_KEYS.concat(constants_2.ARROW_KEYS).includes(event.key)) {
                                onStepKeyDown(event);
                                // Prevent scrolling for directional key presses
                                event.preventDefault();
                            }
                        },
                    }), onMoveShouldSetResponderCapture: () => true, onScrollShouldSetResponder: () => true, onScrollShouldSetResponderCapture: () => true, onMoveShouldSetResponder: () => true, onStartShouldSetResponder: () => true, 
                    // onStartShouldSetResponderCapture={() => true}
                    onResponderTerminationRequest: () => {
                        return false;
                    }, onResponderGrant: helpers_1.composeEventHandlers(props.onResponderGrant, (event) => {
                        const target = event.target;
                        const thumbIndex = context.thumbs.get(target);
                        const isStartingOnThumb = thumbIndex !== undefined;
                        // Prevent browser focus behaviour because we focus a thumb manually when values change.
                        // Touch devices have a delay before focusing so won't focus if touch immediately moves
                        // away from target (sliding). We want thumb to focus regardless.
                        if (constants_1.isWeb && target instanceof HTMLElement) {
                            if (context.thumbs.has(target)) {
                                target.focus();
                            }
                        }
                        // Thumbs won't receive focus events on native, so we have to manually
                        // set the value index to change when sliding starts on a thumb.
                        if (!constants_1.isWeb && isStartingOnThumb) {
                            context.valueIndexToChangeRef.current = thumbIndex;
                        }
                        onSlideStart(event, isStartingOnThumb ? 'thumb' : 'track');
                    }), onResponderMove: helpers_1.composeEventHandlers(props.onResponderMove, (event) => {
                        event.stopPropagation();
                        // const target = event.target as HTMLElement
                        onSlideMove(event);
                    }), onResponderRelease: helpers_1.composeEventHandlers(props.onResponderRelease, (event) => {
                        // const target = event.target as HTMLElement
                        onSlideEnd(event);
                    }) }));
            }));
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2xpZGVySW1wbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TbGlkZXJJbXBsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWVBLHlCQUFhLFdBQVcsR0FBRyxhQUFNLENBQUMsZUFBTSxFQUFFO2dCQUN4QyxRQUFRLEVBQUUsVUFBVTtnQkFFcEIsUUFBUSxFQUFFO29CQUNSLFdBQVcsRUFBRTt3QkFDWCxVQUFVLEVBQUUsRUFBRTt3QkFDZCxRQUFRLEVBQUUsRUFBRTtxQkFDYjtvQkFFRCxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDVCxPQUFNO3dCQUNSLENBQUM7d0JBQ0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTt3QkFDL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBZ0IsQ0FBQyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7d0JBQzNELElBQUksV0FBVyxLQUFLLFlBQVksRUFBRSxDQUFDOzRCQUNqQyxPQUFPO2dDQUNMLE1BQU0sRUFBRSxJQUFJO2dDQUNaLFlBQVksRUFBRSxJQUFJO2dDQUNsQixjQUFjLEVBQUUsUUFBUTs2QkFDekIsQ0FBQTt3QkFDSCxDQUFDO3dCQUNELE9BQU87NEJBQ0wsS0FBSyxFQUFFLElBQUk7NEJBQ1gsWUFBWSxFQUFFLElBQUk7NEJBQ2xCLFVBQVUsRUFBRSxRQUFRO3lCQUNyQixDQUFBO29CQUNILENBQUM7aUJBQ087YUFDWCxDQUFDLEVBQUE7WUFFRix3REFBd0Q7WUFDeEQsNEJBQTRCO1lBRTVCLGdCQUFnQjtZQUNoQixrQkFBa0I7WUFDbEIsaUJBQWlCO1lBQ2pCLDBCQUEwQjtZQUMxQix5QkFBeUI7WUFDekIsMENBQTBD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