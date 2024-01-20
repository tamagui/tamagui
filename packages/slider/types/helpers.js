System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getNextSortedValues(prevValues = [], nextValue, atIndex) {
        const nextValues = [...prevValues];
        nextValues[atIndex] = nextValue;
        return nextValues.sort((a, b) => a - b);
    }
    exports_1("getNextSortedValues", getNextSortedValues);
    function convertValueToPercentage(value, min, max) {
        const maxSteps = max - min;
        const percentPerStep = 100 / maxSteps;
        return percentPerStep * (value - min);
    }
    exports_1("convertValueToPercentage", convertValueToPercentage);
    /**
     * Returns a label for each thumb when there are two or more thumbs
     */
    function getLabel(index, totalValues) {
        if (totalValues > 2) {
            return `Value ${index + 1} of ${totalValues}`;
        }
        if (totalValues === 2) {
            return ['Minimum', 'Maximum'][index];
        }
        return undefined;
    }
    exports_1("getLabel", getLabel);
    /**
     * Given a `values` array and a `nextValue`, determine which value in
     * the array is closest to `nextValue` and return its index.
     *
     * @example
     * // returns 1
     * getClosestValueIndex([10, 30], 25);
     */
    function getClosestValueIndex(values, nextValue) {
        if (values.length === 1)
            return 0;
        const distances = values.map((value) => Math.abs(value - nextValue));
        const closestDistance = Math.min(...distances);
        return distances.indexOf(closestDistance);
    }
    exports_1("getClosestValueIndex", getClosestValueIndex);
    /**
     * Offsets the thumb centre point while sliding to ensure it remains
     * within the bounds of the slider when reaching the edges
     */
    function getThumbInBoundsOffset(width, left, direction) {
        const quarterWidth = width / 4; // changed to quarter width to allow some overlap but not so much
        const halfPercent = 50;
        const offset = linearScale([0, halfPercent], [0, quarterWidth]);
        return (quarterWidth - offset(left) * direction) * direction;
    }
    exports_1("getThumbInBoundsOffset", getThumbInBoundsOffset);
    /**
     * Gets an array of steps between each value.
     *
     * @example
     * // returns [1, 9]
     * getStepsBetweenValues([10, 11, 20]);
     */
    function getStepsBetweenValues(values) {
        return values.slice(0, -1).map((value, index) => values[index + 1] - value);
    }
    /**
     * Verifies the minimum steps between all values is greater than or equal
     * to the expected minimum steps.
     *
     * @example
     * // returns false
     * hasMinStepsBetweenValues([1,2,3], 2);
     *
     * @example
     * // returns true
     * hasMinStepsBetweenValues([1,2,3], 1);
     */
    function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
        if (minStepsBetweenValues > 0) {
            const stepsBetweenValues = getStepsBetweenValues(values);
            const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
            return actualMinStepsBetweenValues >= minStepsBetweenValues;
        }
        return true;
    }
    exports_1("hasMinStepsBetweenValues", hasMinStepsBetweenValues);
    // https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
    function linearScale(input, output) {
        return (value) => {
            if (input[0] === input[1] || output[0] === output[1])
                return output[0];
            const ratio = (output[1] - output[0]) / (input[1] - input[0]);
            return output[0] + ratio * (value - input[0]);
        };
    }
    exports_1("linearScale", linearScale);
    function getDecimalCount(value) {
        return (String(value).split('.')[1] || '').length;
    }
    exports_1("getDecimalCount", getDecimalCount);
    function roundValue(value, decimalCount) {
        const rounder = 10 ** decimalCount;
        return Math.round(value * rounder) / rounder;
    }
    exports_1("roundValue", roundValue);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oZWxwZXJzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFBQSxTQUFnQixtQkFBbUIsQ0FDakMsYUFBdUIsRUFBRSxFQUN6QixTQUFpQixFQUNqQixPQUFlO1FBRWYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFBO1FBQ2xDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLENBQUE7UUFDL0IsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7O0lBRUQsU0FBZ0Isd0JBQXdCLENBQUMsS0FBYSxFQUFFLEdBQVcsRUFBRSxHQUFXO1FBQzlFLE1BQU0sUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDMUIsTUFBTSxjQUFjLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQTtRQUNyQyxPQUFPLGNBQWMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUN2QyxDQUFDOztJQUVEOztPQUVHO0lBQ0gsU0FBZ0IsUUFBUSxDQUFDLEtBQWEsRUFBRSxXQUFtQjtRQUN6RCxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNwQixPQUFPLFNBQVMsS0FBSyxHQUFHLENBQUMsT0FBTyxXQUFXLEVBQUUsQ0FBQTtRQUMvQyxDQUFDO1FBQ0QsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN0QyxDQUFDO1FBQ0QsT0FBTyxTQUFTLENBQUE7SUFDbEIsQ0FBQzs7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsTUFBZ0IsRUFBRSxTQUFpQjtRQUN0RSxJQUFJLE1BQU0s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