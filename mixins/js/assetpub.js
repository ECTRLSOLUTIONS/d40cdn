var d40_assetpub = {
    data: {
        allItems: [],
        docs: [],
        pagination: [],
        skippedRowsInDocs: 0,
        jsonParams: {},
        totalItems: 0,
        indicatorLoading: false,
    },
    created() {
        this.initFilter();
        this.fetchData();
    },
    computed: {
        searchableList() {
            var that = this;

            return _.filter(this.allItems, (item) => {
                return item.title.toLowerCase().includes(_.find(that.filterConfig.filterGroup, ["paramName", "kw"]).value.toLowerCase());
            });
        },
        pageStart() {
            return (this.filterConfig.currentPage - 1) * Number(this.filterConfig.pageSize);
        },
        pageEnd() {
            return this.pageStart + Number(this.filterConfig.pageSize);
        },
        visibleDocs() {
            return this.allItems.slice(this.pageStart, this.pageEnd);
        },
    },
    methods: {
        initFilter() {
            var that = this;

            console.log("router: ", this.$route.query);

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
            var that = this,
                skipRows = (this.filterConfig.currentPage - 1) * this.filterConfig.pageSize;

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

            if (this.filterConfig.routerEnabled) {
                this.pushNewParams();
            }

            var rowsToSkip = Math.floor(skipRows / this.filterConfig.maxItemInMap) * this.filterConfig.maxItemInMap;
            rowsToSkip < 0 ? (this.skippedRowsInDocs = 0) : (this.skippedRowsInDocs = rowsToSkip);

            this.jsonParams.pag = this.filterConfig.currentPage;

            if (typeof this.runBeforeFetch === "function") {
                this.runBeforeFetch();
            }

            axios
                .get(this.filterConfig.endPoint + JSON.stringify(this.jsonParams))
                .then((res) => {
                    console.log("Data fetched, result: ", res.data);
                    that.docs = [];

                    if (res.data.facetedValues) {
                        that.applyFacets(res.data.facetedValues);
                    }

                    if (res.data.docs) {
                        that.allItems = res.data.docs;
                    } else {
                        that.allItems = [];
                    }

                    that.totalItems = res.data.metadata.numFound;
                    that.allItems.forEach((item, index) => {
                        if (index < that.filterConfig.pageSize) {
                            that.docs.push(item);
                        }
                    });

                    that.buildPagination(that.totalItems);
                })
                .catch((err) => {
                    console.log("Error fetching data: ", err);

                    that.allItems = that.docs = [];
                    that.totalItems = 0;
                })
                .finally(() => {
                    if (typeof that.runAfterFetch === "function") {
                        that.runAfterFetch();
                    }

                    that.loading = false;
                });
        },
        fetchMoreData() {
            var that = this;

            this.indicatorLoading = true;
            this.filterConfig.currentPage = this.filterConfig.currentPage + 1;
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

            if (this.filterConfig.routerEnabled) {
                this.pushNewParams();
            }

            this.jsonParams.pag = this.filterConfig.currentPage;

            if (typeof this.runBeforeFetch === "function") {
                this.runBeforeFetch();
            }

            axios
                .get(this.filterConfig.endPoint + JSON.stringify(this.jsonParams))
                .then((res) => {
                    console.log("Data fetched, result: ", res.data);

                    if (res.data.facetedValues) {
                        that.applyFacets(res.data.facetedValues);
                    }

                    if (res.data.docs) {
                        that.allItems.push(...res.data.docs);
                        that.docs.push(...res.data.docs);
                    }

                    that.totalItems = res.data.metadata.numFound;
                })
                .catch((err) => {
                    console.log("Error fetching data: ", err);

                    that.allItems = that.docs = [];
                    that.totalItems = 0;
                })
                .finally(() => {
                    if (typeof that.runAfterFetch === "function") {
                        that.runAfterFetch();
                    }

                    that.indicatorLoading = false;
                });
        },
        applyFacets(facetedValues) {
            console.log("Applying faceted values: ", facetedValues);

            this.filterConfig.filterGroup.forEach((fg) => {
                if (fg.type == "select" || fg.type == "checkboxes") {
                    if (_.isEmpty(facetedValues)) {
                        fg.categories.forEach((cat) => {
                            cat.counter = 0;
                        });
                    } else {
                        fg.categories.forEach((cat) => {
                            cat.counter = facetedValues[fg.paramName].values[cat.categoryId.trim()];
                            !cat.counter ? (cat.counter = 0) : "";
                        });
                    }
                }
            });
        },
        pushNewParams() {
            this.$router
                .replace({
                    path: window.location.pathname,
                    query: this.jsonParams,
                })
                .catch((err) => {
                    if (err.name != "NavigationDuplicated") {
                        console.error(err);
                    }
                });
        },
        resetFilter() {
            this.filterConfig.filterGroup.forEach((fg) => {
                if (fg.type == "select" || fg.type == "textinput" || fg.type == "dateinput") {
                    fg.selected = "";
                }
                if (fg.type == "checkboxes") {
                    fg.categories.forEach((cat) => {
                        cat.selected = "";
                    });
                }
            });

            this.fetchData();
        },
        resetFilterGroup(paramName) {
            if (this.getFilterGroup(paramName).type == "select" || this.getFilterGroup(paramName).type == "textinput" || this.getFilterGroup(paramName).type == "dateinput") {
                this.getFilterGroup(paramName).selected = "";
            }
            if (this.getFilterGroup(paramName).type == "checkboxes") {
                this.getFilterGroup(paramName).value = [];
                this.getFilterGroup(paramName).categories.forEach((cat) => {
                    cat.selected = false;
                });
            }

            this.fetchData();
        },
        getFilterGroup(name) {
            return _.find(this.filterConfig.filterGroup, ["paramName", name]);
        },
        buildQueryParams(names = []) {
            var params = "";

            if (names.length > 0) {
                names.forEach((p) => {
                    if (this.$route.query[p]) {
                        params += "&" + p + "=" + this.$route.query[p];
                    }
                });
            } else {
                if (this.$route.query.kw) {
                    params += "&kw=" + this.$route.query.kw;
                }
                if (this.$route.query.d1) {
                    params += "&d1=" + this.$route.query.d1;
                }
                if (this.$route.query.d2) {
                    params += "&d2=" + this.$route.query.d2;
                }
                if (this.$route.query.p1) {
                    params += "&p1=" + this.$route.query.p1;
                }
                if (this.$route.query.p2) {
                    params += "&p2=" + this.$route.query.p2;
                }
                if (this.$route.query.p3) {
                    params += "&p3=" + this.$route.query.p3;
                }
                if (this.$route.query.p4) {
                    params += "&p4=" + this.$route.query.p4;
                }
                if (this.$route.query.p5) {
                    params += "&p5=" + this.$route.query.p5;
                }
            }

            return params;
        },
        loadMore(num) {
            var that = this,
                itemsToShow = this.docs.length + num;

            this.docs = [];

            this.allItems.forEach((item, index) => {
                if (index < itemsToShow) {
                    that.docs.push(item);
                }
            });
        },
        gotoPage(page) {
            console.log("Going to page " + page);

            this.filterConfig.currentPage = page;

            var skipRows = page-- * this.filterConfig.pageSize;

            if (this.allItems.length > 0 && skipRows < this.skippedRowsInDocs + this.allItems.length && skipRows >= this.skippedRowsInDocs) {
                this.docs = [];

                for (var x = skipRows; x < skipRows + this.filterConfig.pageSize && x - this.skippedRowsInDocs < this.allItems.length; x++) {
                    this.docs.push(this.allItems[x - this.skippedRowsInDocs]);
                }

                this.jsonParams.pag = this.filterConfig.currentPage;

                if (this.filterConfig.routerEnabled) {
                    this.pushNewParams();
                }

                this.buildPagination(this.totalItems);
            } else {
                this.fetchData();
            }

            if (this.$refs.results) {
                this.$refs.results.scrollIntoView({
                    block: "start",
                    behavior: "smooth",
                });
            }
        },
        buildPagination(totalItems) {
            this.pagination = [];

            var totalPages = Math.floor((totalItems - 1) / this.filterConfig.pageSize) + 1 <= 0 ? 1 : Math.floor((totalItems - 1) / this.filterConfig.pageSize) + 1;

            var firstPage = {
                num: 1,
                pos: "first",
            };
            this.pagination.push(firstPage);

            var prevPage = {};
            if (this.filterConfig.currentPage > 1) {
                prevPage.num = prevPage.char = this.filterConfig.currentPage - 1;
                this.pagination.push(prevPage);
            }

            var activePage = {
                num: this.filterConfig.currentPage,
                char: this.filterConfig.currentPage.toString(),
                active: true,
            };
            this.pagination.push(activePage);

            var nextPage = {};
            if (this.filterConfig.currentPage < totalPages) {
                nextPage.num = nextPage.char = this.filterConfig.currentPage + 1;
                this.pagination.push(nextPage);
            }

            var lastPage = {
                num: totalPages,
                pos: "last",
            };
            this.pagination.push(lastPage);

            console.log("Pagination based on " + totalItems + " items");
        },
        firstOrLast(pag) {
            if ((this.jsonParams.pag == 1 && pag.pos == "first") || (Math.floor((this.totalItems - 1) / this.filterConfig.pageSize) + 1 == this.jsonParams.pag && pag.pos == "last")) {
                return true;
            } else {
                return false;
            }
        },
    },
};
