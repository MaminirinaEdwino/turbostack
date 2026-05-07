export const GoApp = {
    sayHello: async (name) => {
        if (window.SayHello) {
            return await window.sayHello(name);
        }
        // Fallback pour le développement dans un navigateur classique
        return `Mode démo : Bonjour ${name}`;
    },
    getStats: async () => {
        if (window.GetStats) {
            return await window.getStats();
        }
        return { os: "Browser", arch: "wasm" };
    }
}