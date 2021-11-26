export function concatClassName(_cn) {
    const classNamesOrPropObjects = arguments;
    const usedPrefixes = [];
    let final = '';
    const len = classNamesOrPropObjects.length;
    let propObjects = null;
    for (let x = len; x >= 0; x--) {
        const cns = classNamesOrPropObjects[x];
        if (!cns)
            continue;
        if (!Array.isArray(cns) && typeof cns !== 'string') {
            propObjects = propObjects || [];
            propObjects.push(cns);
            continue;
        }
        const names = Array.isArray(cns) ? cns : cns.split(' ');
        const numNames = names.length;
        for (let i = numNames - 1; i >= 0; i--) {
            const name = names[i];
            if (!name || name === ' ')
                continue;
            if (name[0] !== '_') {
                final = name + ' ' + final;
                continue;
            }
            const splitIndex = name.indexOf('-');
            if (splitIndex < 1) {
                final = name + ' ' + final;
                continue;
            }
            const nextChar = name[splitIndex + 1];
            const isMediaQuery = nextChar === '_';
            const isPsuedoQuery = nextChar === '-';
            const styleKey = name.slice(1, splitIndex);
            const mediaKey = isMediaQuery || isPsuedoQuery ? name.slice(splitIndex + 2, splitIndex + 7) : null;
            const uid = mediaKey ? styleKey + mediaKey : styleKey;
            if (!isMediaQuery && !isPsuedoQuery) {
                if (usedPrefixes.indexOf(uid) > -1) {
                    continue;
                }
                usedPrefixes.push(uid);
            }
            const propName = styleKey;
            if (propName && propObjects) {
                if (propObjects.some((po) => {
                    if (mediaKey) {
                        const propKey = pseudoInvert[mediaKey];
                        return po && po[propKey] && propName in po[propKey] && po[propKey] !== null;
                    }
                    const res = po && propName in po && po[propName] !== null;
                    return res;
                })) {
                    continue;
                }
            }
            final = name + ' ' + final;
        }
    }
    return final;
}
const pseudoInvert = {
    hover: 'hoverStyle',
    focus: 'focusStyle',
    press: 'pressStyle',
};
