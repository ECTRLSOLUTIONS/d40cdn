var d40_basicadt = {
    data: {
        docs: [],
        jsonParams: {},
        totalItems: 0,
    },
    created() {
        this.initFilter();
        this.fetchData();
    },
    methods: {
        initFilter() {
            var that = this;

            if (this.$route.query.num) {
                this.filterConfig.pageSize = this.$route.query.num;
            }
            if (this.$route.query.pag) {
                this.filterConfig.currentPage = Number(this.$route.query.pag);
            }
            if (this.$route.query.qry) {
                this.filterConfig.qry = this.$route.query.qry;
            }

            this.filterConfig.filterGroup.forEach((fg) => {
                var value = that.$route.query[fg.paramName],
                    catSelected = [];

                if (value) {
                    if (fg.type == "textinput" || fg.type == "dateinput") {
                        fg.value = value;
                    }
                    if (fg.type == "select") {
                        value == 0 ? (fg.selected = "") : (fg.selected = value);
                    }
                    if (fg.type == "checkboxes") {
                        catSelected = value.split(",");
                        fg.categories.forEach((cat) => {
                            var found = false;

                            catSelected.forEach((selection) => {
                                if (selection.trim() == cat.categoryId) {
                                    found = true;
                                }
                            });

                            cat.selected = found;
                        });
                    }
                }
            });
        },
        fetchData() {
            var that = this;

            this.loading = true;
            this.jsonParams.structureKey = this.filterConfig.structureKey;
            this.jsonParams.pag = this.filterConfig.currentPage;
            this.jsonParams.num = this.filterConfig.pageSize;
            this.jsonParams.qry = this.filterConfig.qry;
            this.jsonParams.so = this.filterConfig.so;
            this.jsonParams.f0 = this.filterConfig.f0;
            this.jsonParams.f1 = this.filterConfig.f1;
            this.jsonParams.c1 = this.filterConfig.c1;
            this.jsonParams.queryAndOperator0 = this.filterConfig.queryAndOperator0;
            this.jsonParams.queryAndOperator1 = this.filterConfig.queryAndOperator1;
            this.jsonParams.queryAndOperatorC1 = this.filterConfig.queryAndOperatorC1;
            this.jsonParams.orderByColumn1 = this.filterConfig.orderByColumn1;
            this.jsonParams.orderByColumn2 = this.filterConfig.orderByColumn2;
            this.jsonParams.orderByType1 = this.filterConfig.orderByType1;
            this.jsonParams.orderByType2 = this.filterConfig.orderByType2;

            this.filterConfig.filterGroup.forEach((fg) => {
                var value = "";

                if (fg.type == "textinput" || fg.type == "dateinput") {
                    value = fg.value;
                }
                if (fg.type == "select") {
                    fg.selected.trim() == 0 ? (value = "") : (value = fg.selected.trim());
                }
                if (fg.type == "checkboxes") {
                    fg.value = "";

                    fg.categories.forEach((cat) => {
                        if (cat.selected) {
                            if (value.length > 0) {
                                value += ", ";
                            }
                            value += cat.categoryId.trim();

                            if (fg.value.length > 0) {
                                fg.value += ", ";
                            }
                            fg.value += cat.label;
                        }
                    });
                }

                that.jsonParams[fg.paramName] = value;
            });

            if (typeof this.runBeforeFetch === "function") {
                this.runBeforeFetch();
            }

            axios
                .get(this.filterConfig.endPoint + JSON.stringify(this.jsonParams))
                .then((res) => {
                    if (that.filterConfig?.debugMode || that.debugMode) {
                        console.log("Data fetched, result: ", res.data);
                    }

                    res.data.docs ? (that.docs = res.data.docs) : (that.docs = []);

                    that.totalItems = res.data.metadata.numFound;
                })
                .catch((err) => {
                    console.error("Error fetching data: ", err);

                    that.docs = [];
                    that.totalItems = 0;
                })
                .finally(() => {
                    if (typeof that.runAfterFetch === "function") {
                        that.runAfterFetch();
                    }

                    that.loading = false;
                });
        },
    },
};
