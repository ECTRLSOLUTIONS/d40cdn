function initVueADT(portletId, namespace = "", filterConfig, mixins = []) {
    var instanceName = "vue_" + portletId.split("INSTANCE_")[1] + "app";

    window[instanceName] = new Vue({
        el: portletId,
        mixins: mixins,
        router: new VueRouter({
            routes: [],
            mode: filterConfig.routerMode,
        }),
        data: {
            loading: true,
            groupedCategories: [],
            filterConfig: filterConfig,
            namespace: namespace,
        },
        created() {
            console.log("Vue ADT instance created. Access it using window." + instanceName);
        },
    });
}
