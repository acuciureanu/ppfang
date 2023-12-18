const types = [Object, String, Number, Array, Function];

const prototypePropertyNames = new Map();
types.forEach(type => prototypePropertyNames.set(type.name, Object.getOwnPropertyNames(type.prototype)));

const probe = () => {
    const userDefinedProps = [];

    prototypePropertyNames.forEach((props, key) => {
        const prototype = window[key]?.prototype;

        for (let i = 0; i < props.length; i++) {
            const prop = props[i];
            let propValue;

            try {
                propValue = prototype[prop];
                if (typeof propValue === 'function' && !propValue.toString().includes('[native code]')) {
                    userDefinedProps.push(`${key}.prototype.${prop}`);
                }
            } catch (e) {
                // Ignore errors
            }
        }
    });

    return userDefinedProps;
};
