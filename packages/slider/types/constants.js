System.register(["@tamagui/create-context"], function (exports_1, context_1) {
    "use strict";
    var create_context_1, SLIDER_NAME, _a, createSliderContext, createSliderScope, _b, SliderProvider, useSliderContext, _c, SliderOrientationProvider, useSliderOrientationContext, PAGE_KEYS, ARROW_KEYS, BACK_KEYS;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (create_context_1_1) {
                create_context_1 = create_context_1_1;
            }
        ],
        execute: function () {
            exports_1("SLIDER_NAME", SLIDER_NAME = 'Slider');
            _a = __read(create_context_1.createContextScope(SLIDER_NAME), 2), exports_1("createSliderContext", createSliderContext = _a[0]), exports_1("createSliderScope", createSliderScope = _a[1]);
            _b = __read(createSliderContext(SLIDER_NAME), 2), exports_1("SliderProvider", SliderProvider = _b[0]), exports_1("useSliderContext", useSliderContext = _b[1]);
            _c = __read(createSliderContext(SLIDER_NAME, {
                startEdge: 'left',
                endEdge: 'right',
                sizeProp: 'width',
                size: 0,
                direction: 1,
            }), 2), exports_1("SliderOrientationProvider", SliderOrientationProvider = _c[0]), exports_1("useSliderOrientationContext", useSliderOrientationContext = _c[1]);
            exports_1("PAGE_KEYS", PAGE_KEYS = ['PageUp', 'PageDown']);
            exports_1("ARROW_KEYS", ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
            exports_1("BACK_KEYS", BACK_KEYS = {
                ltr: ['ArrowDown', 'Home', 'ArrowLeft', 'PageDown'],
                rtl: ['ArrowDown', 'Home', 'ArrowRight', 'PageDown'],
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbnN0YW50cy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFLQSx5QkFBYSxXQUFXLEdBQUcsUUFBUSxFQUFBO1lBRXRCLEtBQUEsT0FBMkMsbUNBQWtCLENBQUMsV0FBVyxDQUFDLElBQUEsbUNBQXpFLG1CQUFtQixRQUFBLGtDQUFFLGlCQUFpQixRQUFBLEVBQW1DO1lBRTFFLEtBQUEsT0FDWCxtQkFBbUIsQ0FBcUIsV0FBVyxDQUFDLElBQUEsOEJBRHhDLGNBQWMsUUFBQSxpQ0FBRSxnQkFBZ0IsUUFBQSxFQUNRO1lBRXpDLEtBQUEsT0FDWCxtQkFBbUIsQ0FNaEIsV0FBVyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixPQUFPLEVBQUUsT0FBTztnQkFDaEIsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLElBQUksRUFBRSxDQUFDO2dCQUNQLFNBQVMsRUFBRSxDQUFDO2FBQ2IsQ0FBQyxJQUFBLHlDQWJVLHlCQUF5QixRQUFBLDRDQUFFLDJCQUEyQixRQUFBLEVBYWhFO1lBRUosdUJBQWEsU0FBUyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFBO1lBQy9DLHdCQUFhLFVBQVUsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxFQUFBO1lBQzdFLHVCQUFhLFNBQVMsR0FBZ0M7Z0JBQ3BELEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQztnQkFDbkQsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDO2FBQ3JELEVBQUEifQ==