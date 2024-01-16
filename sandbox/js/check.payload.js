let cleanWindow = null;

const getCleanWindow = () => {
    if (!cleanWindow) {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        cleanWindow = iframe.contentWindow;
        document.body.removeChild(iframe);
    }
    return cleanWindow;
};

const types = [Object, String, Number, Array, Function, Date, Boolean, RegExp];
const prototypePropertyNames = new Map();

const calculateDifferences = (type) => {
    const cleanProps = Object.getOwnPropertyNames(getCleanWindow()[type.name].prototype);
    const currentProps = Object.getOwnPropertyNames(window[type.name].prototype);
    return currentProps.filter((prop) => !cleanProps.includes(prop));
};

const probe = () => {
    let findings = [];
    types.forEach((type) => {
        if (!prototypePropertyNames.has(type.name)) {
            prototypePropertyNames.set(type.name, calculateDifferences(type));
        }

        prototypePropertyNames.get(type.name).forEach((prop) => {
            findings.push(`${type.name}.prototype.${prop}`);
        });
    });
    return findings;
};
