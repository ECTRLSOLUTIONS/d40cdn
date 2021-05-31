function initVueADT(portletId, namespace = "", filterConfig, mixins = []) {
    new Vue({
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
            console.log("Vue ADT " + this.namespace + " created");
        },
        mounted() {
            console.log("Vue ADT " + this.namespace + " created");
        },
    });
}
