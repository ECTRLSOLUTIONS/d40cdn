var d40_filter = {
    router: new VueRouter({
        mode: "history",
        routes: [],
    }),
    data: {
        filter: {
            allItems: [],
            docs: [],
            pagination: [],
            filterConfig: filterConfig,
            skippedRowsInDocs: 0,
            jsonParams: {},
            totalItems: 0,
            loading: true,
        },
    },
    created() {
        this.initFilter();
        this.fetchData();
    },
    computed: {
        searchableList: function () {
            var that = this;

            return _.filter(this.filter.allItems, function (item) {
                return item.title.toLowerCase().includes(_.find(that.filter.filterConfig.filterGroups, ["paramName", "kw"]).value.toLowerCase());
            });
        },
    },
    methods: {
        initFilter: function () {
            var that = this;

            if (this.$route.query.num) {
                this.filter.filterConfig.pageSize = this.$route.query.num;
            }
            if (this.$route.query.pag) {
                this.filter.filterConfig.currentPage = Number(this.$route.query.pag);
            }
            if (this.$route.query.qry) {
                this.filter.filterConfig.qry = this.$route.query.qry;
            }

            this.filter.filterConfig.filterGroups.forEach(function (filterGroup) {
                var value = that.$route.query[filterGroup.paramName],
                    catSelected;

                if (value) {
                    if (filterGroup.type == "textInput" || filterGroup.type == "dateInput") {
                        filterGroup.value = value;
                    }
                    if (filterGroup.type == "select") {
                        value == 0 ? (filterGroup.selected = "") : (filterGroup.selected = value);
                    }
                    if (filterGroup.type == "multiSelect") {
                        catSelected = value.split(",");

                        filterGroup.categories.forEach(function (cat) {
                            var found = false;

                            catSelected.forEach(function (selection) {
                                if (selection.trim() == cat.categoryId) {
                                    found = true;
                                }
                            });

                            cat.selected = found;
                        });
                    }
                    if (filterGroup.type == "checkBoxes") {
                        catSelected = value.split(",");
                        filterGroup.categories.forEach(function (cat) {
                            var found = [];

                            catSelected.forEach(function (selection) {
                                if (selection.trim() == cat.categoryId) {
                                    found += selection.trim();
                                }
                            });

                            filterGroup.selected = found;
                        });
                    }
                }
            });
        },
        fetchData: function () {
            var that = this,
                path,
                skipRows = (this.filter.filterConfig.currentPage - 1) * this.filter.filterConfig.pageSize;

            this.filter.loading = true;
            this.filter.jsonParams.pag = this.filter.filterConfig.currentPage;
            this.filter.jsonParams.num = this.filter.filterConfig.pageSize;
            this.filter.jsonParams.qry = this.filter.filterConfig.qry;
            this.filter.jsonParams.so = this.filter.filterConfig.so;

            this.filter.filterConfig.filterGroups.forEach(function (filterGroup) {
                var value = "";

                if (filterGroup.type == "textInput" || filterGroup.type == "dateInput") {
                    value = filterGroup.value;
                }
                if (filterGroup.type == "select") {
                    filterGroup.selected.trim() == 0 ? (value = "") : (value = filterGroup.selected.trim());
                }
                if (filterGroup.type == "multiSelect") {
                    filterGroup.selected.forEach(function (selection) {
                        if (selection.categoryId) {
                            if (value.length > 0) {
                                value += ", ";
                            }
                            value += selection.categoryId.trim();
                        }
                    });
                }
                if (filterGroup.type == "checkBoxes") {
                    filterGroup.categories.forEach(function (cat) {
                        if (cat.selected) {
                            if (value.length > 0) {
                                value += ", ";
                            }
                            value += cat.categoryId.trim();
                        }
                    });
                }

                that.filter.jsonParams[filterGroup.paramName] = value;
            });

            this.pushNewParams();

            var rowsToSkip = Math.floor(skipRows / this.filter.filterConfig.maxItemInMap) * this.filter.filterConfig.maxItemInMap;
            rowsToSkip < 0 ? (this.filter.skippedRowsInDocs = 0) : (this.filter.skippedRowsInDocs = rowsToSkip);

            this.filter.jsonParams.pag = this.filter.filterConfig.currentPage;
            this.filter.jsonParams.num = this.filter.filterConfig.maxDocsToFetch;

            if (window.location.pathname.includes("/-/d/")) {
                path = window.location.pathname.split("/-/d/")[0];
            } else {
                path = window.location.pathname;
            }

            axios
                .get(window.location.origin + path + "?p_p_id=Configurable&p_p_lifecycle=2&p_p_resource_id=json&_Configurable_jsonParams=" + JSON.stringify(this.$route.query))
                .then(function (res) {
                    console.log("Data fetched, result: ", res.data);
                    that.filter.docs = [];

                    if (res.data.facetedValues) {
                        that.applyFacets(res.data.facetedValues);
                    }

                    that.filter.allItems = res.data.docs;
                    that.filter.totalItems = res.data.metadata.numFound;
                    that.filter.allItems.forEach(function (item, index) {
                        if (index < that.filter.filterConfig.pageSize) {
                            that.filter.docs.push(item);
                        }
                    });

                    that.buildPagination(that.filter.totalItems);
                })
                .catch(function (err) {
                    console.log("Error fetching data: ", err);

                    that.filter.allItems = [];
                    that.filter.docs = [];
                    that.filter.totalItems = 0;
                })
                .finally(function () {
                    that.filter.loading = false;
                    that.initFilter();
                });
        },
        applyFacets: function (facetedValues) {
            console.log("Applying faceted values: ", facetedValues);

            this.filter.filterConfig.filterGroups.forEach(function (filterGroup) {
                if (filterGroup.type == "select" || filterGroup.type == "checkBoxes") {
                    if (_.isEmpty(facetedValues)) {
                        filterGroup.categories.forEach(function (cat) {
                            cat.counter = 0;
                        });
                    } else {
                        filterGroup.categories.forEach(function (cat) {
                            cat.counter = facetedValues[filterGroup.paramName].values[cat.categoryId.trim()];
                            !cat.counter ? (cat.counter = 0) : "";
                        });
                    }
                }
            });
        },
        pushNewParams: function () {
            this.$router
                .replace({
                    path: window.location.pathname,
                    query: this.filter.jsonParams,
                })
                .catch((err) => {
                    if (err.name != "NavigationDuplicated") {
                        console.error(err);
                    }
                });
        },
        resetFilter: function () {
            this.filter.filterConfig.filterGroups.forEach(function (filterGroup) {
                if (filterGroup.type == "select" || filterGroup.type == "textInput" || filterGroup.type == "dateInput") {
                    filterGroup.selected = "";
                }
                if (filterGroup.type == "multiSelect") {
                    filterGroup.selected = [];
                }
                if (filterGroup.type == "checkBoxes") {
                    filterGroup.categories.forEach(function (cat) {
                        cat.selected = "";
                    });
                }
            });

            this.fetchData();
        },
        gotoPage: function (page) {
            console.log("Going to page " + page);

            this.filter.filterConfig.currentPage = page;

            var skipRows = page-- * this.filter.filterConfig.pageSize;

            if (this.filter.allItems.length > 0 && skipRows < this.filter.skippedRowsInDocs + this.filter.allItems.length && skipRows >= this.filter.skippedRowsInDocs) {
                this.filter.docs = [];

                for (var x = skipRows; x < skipRows + this.filter.filterConfig.pageSize && x - this.filter.skippedRowsInDocs < this.filter.allItems.length; x++) {
                    this.filter.docs.push(this.filter.allItems[x - this.filter.skippedRowsInDocs]);
                }

                this.filter.jsonParams.pag = this.filter.filterConfig.currentPage;
                this.pushNewParams();
                this.buildPagination(this.filter.totalItems);
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
        buildPagination: function (totalItems) {
            this.filter.pagination = [];

            var totalPages = Math.floor((totalItems - 1) / filterConfig.pageSize) + 1 <= 0 ? 1 : Math.floor((totalItems - 1) / this.filter.filterConfig.pageSize) + 1;

            var firstPage = {
                num: 1,
                pos: "first",
            };
            this.filter.pagination.push(firstPage);

            var prevPage = {};
            if (this.filter.filterConfig.currentPage > 1) {
                prevPage.num = this.filter.filterConfig.currentPage - 1;
                prevPage.char = this.filter.filterConfig.currentPage - 1;
                this.filter.pagination.push(prevPage);
            }

            var activePage = {
                num: this.filter.filterConfig.currentPage,
                char: this.filter.filterConfig.currentPage.toString(),
                active: true,
            };
            this.filter.pagination.push(activePage);

            var nextPage = {};
            if (this.filter.filterConfig.currentPage < totalPages) {
                nextPage.num = this.filter.filterConfig.currentPage + 1;
                nextPage.char = this.filter.filterConfig.currentPage + 1;
                this.filter.pagination.push(nextPage);
            }

            var lastPage = {
                num: totalPages,
                pos: "last",
            };
            this.filter.pagination.push(lastPage);

            console.log("Pagination based on " + totalItems + " items");
        },
        firstOrLast: function (pag) {
            if ((this.filter.jsonParams.pag == 1 && pag.pos == "first") || (Math.floor((this.filter.totalItems - 1) / this.filter.filterConfig.pageSize) + 1 == this.filter.jsonParams.pag && pag.pos == "last")) {
                return true;
            } else {
                return false;
            }
        },
    },
};
