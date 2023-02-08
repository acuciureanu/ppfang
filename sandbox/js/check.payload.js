const types = [Object, String, Number, Array, Function, Boolean];

const prototypesPropertiesReducer = (acc, type) => ({
    ...acc,
    [type.name]: Object.getOwnPropertyNames(type.prototype),
});

const prototypePropertyNames = types.reduce(prototypesPropertiesReducer, {});

// This function checks if a prototype property is polluted by changing its value
// and checking if the value has changed. It returns a boolean indicating if the
// property is polluted.
const checkIfPrototypePropertyIsPolluted = (object, prop) => {
  // Get the original value of the prototype property
  const originalValue = Object.getOwnPropertyDescriptor(object, prop);
  try {
    // Change the value of the prototype property
    object[prop] = 'polluted';
    // If the value of the prototype property is 'polluted', it is polluted
    if (object[prop] === 'polluted') {
      return true;
    }
  } catch (e) {
    // The property is read-only, so it is not polluted.
    return false;
  } finally {
    // Restore the original value of the prototype property
    Object.defineProperty(object, prop, originalValue);
  }
  return false;
};

// This function probes for polluted prototype properties and returns an array
// of the names of the polluted properties.
const probe = () =>
    Object.keys(prototypePropertyNames).reduce((acc, key) => {
        for (let propKey of prototypePropertyNames[key]) {
            // Get the prototype property using eval()
            const payload = `${key}.prototype.${propKey}`;
            try {
                const prop = eval(payload);
                // If the prototype property is a function and its prototype is polluted,
                // add its name to the result array.
                if (typeof prop === 'function' && checkIfPrototypePropertyIsPolluted(prop.prototype, propKey)) {
                    acc.push(payload);
                }
            } catch (e) {
                // Nothing to catch now.
            }
        }
        return acc;
    }, []);

probe();
