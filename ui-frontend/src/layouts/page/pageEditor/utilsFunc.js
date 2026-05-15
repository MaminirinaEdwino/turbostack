const parseStyles = (styleString) => {
    if (!styleString) return {};
    return styleString.split(';').reduce((acc, rule) => {
        const parts = rule.split(':');
        if (parts.length < 2) return acc;
        const prop = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        if (prop && value) acc[prop] = value;
        return acc;
    }, {});
};

const stringifyStyles = (styleObj) => {
    return Object.entries(styleObj)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, v]) => v && v !== "")
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
};

export default {parseStyles, stringifyStyles};