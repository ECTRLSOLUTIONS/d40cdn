function initVueApp(portletId, namespace = "", mixins = [], components = {}) {
    var instanceName = "vue_" + portletId.split("INSTANCE_")[1] + "app";

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
            if (this.filterConfig.debugMode) {
                console.warn("Vue app instance created. Access it using " + instanceName + " in console.");
            }
        },
    });
}
