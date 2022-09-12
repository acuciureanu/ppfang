const types = [Object, String, Number, Array, Function, Boolean];

const prototypesPropertiesReducer = (acc, type) => ({
    ...acc,
    [type.name]: Object.getOwnPropertyNames(type.prototype),
});

const prototypePropertyNames = types.reduce(prototypesPropertiesReducer, {});

const probe = () =>
    Object.keys(prototypePropertyNames).reduce((acc, key) => {
        for (let propKey of prototypePropertyNames[key]) {
            const payload = `${key}.prototype.${propKey}`;
            try {
                if (typeof eval(payload) === 'function' && eval(payload).call() === window) {
                    acc.push(payload);
                }
            } catch (e) {
                // Nothing to catch now.
            }
        }
        return acc;
    }, []);

probe();
