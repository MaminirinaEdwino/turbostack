export const GoApp = {
    sayHello: async (name) => {
        if (window.sayHello) {
            return await window.sayHello(name);
        }
        // Fallback pour le développement dans un navigateur classique
        return `Mode démo : Bonjour ${name}`;
    },
    getStats: async () => {
        if (window.getStats) {
            return await window.getStats();
        }
        return { os: "Browser", arch: "wasm" };
    }
}