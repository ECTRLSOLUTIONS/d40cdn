function initVueApp(portletId, namespace = "", mixins = [], components = {}) {
    var instanceName = "vue_";

    if (portletId.includes("INSTANCE")) {
        instanceName += portletId.split("INSTANCE_")[1] + "_app";
    } else {
        instanceName +=
            new Array(1)
                .fill()
                .map(() => Math.random() * 10000)
                .map((n) => n.toString(36).replace(/\./, "")) + "_app";
    }

    window[instanceName] = new Vue({
        el: portletId,
        mixins: mixins,
        components: components,
        data: {
            loading: true,
            namespace: namespace,
            portletId: portletId,
            instanceName: instanceName,
        },
        created() {
            if (this.filterConfig?.debugMode || this.debugMode) {
                console.warn("Vue app instance created. Access it using " + instanceName + " in console.");
            } else {
                console["log"] = () => {};
                console["info"] = () => {};
            }
        },
    });
}
