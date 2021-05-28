function initVueADT(portletId, filterConfig, mixins = []) {
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
        },
        created() {
            this.log("Vue app created");
        },
        mounted() {
            this.log("Vue app mounted");
        },
        methods: {
            log: function (msg) {
                console.log(msg);
            },
        },
    });
}
