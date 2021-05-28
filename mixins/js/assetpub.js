var d40_assetpub = {
    data: {
        allItems: [],
        docs: [],
        pagination: [],
        skippedRowsInDocs: 0,
        jsonParams: {},
        totalItems: 0,
    },
    created() {
        this.initFilter();
        this.fetchData();
    },
    computed: {
        searchableList: function () {
            var that = this;

            return _.filter(this.allItems, function (item) {
                return item.title.toLowerCase().includes(_.find(that.filterConfig.filterGroup, ["paramName", "kw"]).value.toLowerCase());
            });
        },
    },
    methods: {
        initFilter: function () {
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

            this.filterConfig.filterGroup.forEach(function (fg) {
                var value = that.$route.query[fg.paramName],
                    catSelected = [];

                if (value) {
                    if (fg.type == "textinput" || fg.type == "dateinput") {
                        fg.value = value;
                    }
                    if (fg.type == "select") {
                        value == 0 ? (fg.selected = "") : (fg.selected = value);
                    }
                    if (fg.type == "multiselect") {
                        catSelected = value.split(",");

                        fg.categories.forEach(function (cat) {
                            var found = false;

                            catSelected.forEach(function (selection) {
                                if (selection.trim() == cat.categoryId) {
                                    found = true;
                                }
                            });

                            cat.selected = found;
                        });
                    }
                    if (fg.type == "checkboxes") {
                        catSelected = value.split(",");
                        fg.categories.forEach(function (cat) {
                            var found = [];

                            catSelected.forEach(function (selection) {
                                if (selection.trim() == cat.categoryId) {
                                    found += selection.trim();
                                }
                            });

                            fg.selected = found;
                        });
                    }
                }
            });
        },
        fetchData: function () {
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

            this.filterConfig.filterGroup.forEach(function (fg) {
                var value = "";

                if (fg.type == "textinput" || fg.type == "dateinput") {
                    value = fg.value;
                }
                if (fg.type == "select") {
                    fg.selected.trim() == 0 ? (value = "") : (value = fg.selected.trim());
                }
                if (fg.type == "multiselect") {
                    fg.selected.forEach(function (selection) {
                        if (selection.categoryId) {
                            value = selection.categoryId.trim().join(", ");
                        }
                    });
                }
                if (fg.type == "checkboxes") {
                    fg.categories.forEach(function (cat) {
                        if (cat.selected) {
                            value = cat.categoryId.trim().join(", ");
                        }
                    });
                }

                that.jsonParams[fg.paramName] = value;
            });

            this.pushNewParams();

            var rowsToSkip = Math.floor(skipRows / this.filterConfig.maxItemInMap) * this.filterConfig.maxItemInMap;
            rowsToSkip < 0 ? (this.skippedRowsInDocs = 0) : (this.skippedRowsInDocs = rowsToSkip);

            this.jsonParams.pag = this.filterConfig.currentPage;
            this.jsonParams.num = this.filterConfig.maxDocsToFetch;

            //window.location.origin + window.location.pathname + "?p_p_id=Configurable&p_p_lifecycle=2&p_p_resource_id=json&_Configurable_jsonParams="

            axios
                .get(this.filterConfig.endPoint + JSON.stringify(this.$route.query))
                .then(function (res) {
                    console.log("Data fetched, result: ", res.data);
                    that.docs = [];

                    if (res.data.facetedValues) {
                        that.applyFacets(res.data.facetedValues);
                    }

                    that.allItems = res.data.docs;
                    that.totalItems = res.data.metadata.numFound;
                    that.allItems.forEach(function (item, index) {
                        if (index < that.filterConfig.pageSize) {
                            that.docs.push(item);
                        }
                    });

                    that.buildPagination(that.totalItems);
                })
                .catch(function (err) {
                    console.log("Error fetching data: ", err);

                    that.allItems = that.docs = [];
                    that.totalItems = 0;
                })
                .finally(function () {
                    that.loading = false;
                    that.initFilter();
                });
        },
        applyFacets: function (facetedValues) {
            console.log("Applying faceted values: ", facetedValues);

            this.filterConfig.filterGroup.forEach(function (fg) {
                if (fg.type == "select" || fg.type == "checkboxes") {
                    if (_.isEmpty(facetedValues)) {
                        fg.categories.forEach(function (cat) {
                            cat.counter = 0;
                        });
                    } else {
                        fg.categories.forEach(function (cat) {
                            cat.counter = facetedValues[fg.paramName].values[cat.categoryId.trim()];
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
                    query: this.jsonParams,
                })
                .catch((err) => {
                    if (err.name != "NavigationDuplicated") {
                        console.error(err);
                    }
                });
        },
        resetFilter: function () {
            this.filterConfig.filterGroup.forEach(function (fg) {
                if (fg.type == "select" || fg.type == "textinput" || fg.type == "dateinput") {
                    fg.selected = "";
                }
                if (fg.type == "multiselect") {
                    fg.selected = [];
                }
                if (fg.type == "checkboxes") {
                    fg.categories.forEach(function (cat) {
                        cat.selected = "";
                    });
                }
            });

            this.fetchData();
        },
        gotoPage: function (page) {
            console.log("Going to page " + page);

            this.filterConfig.currentPage = page;

            var skipRows = page-- * this.filterConfig.pageSize;

            if (this.allItems.length > 0 && skipRows < this.skippedRowsInDocs + this.allItems.length && skipRows >= this.skippedRowsInDocs) {
                this.docs = [];

                for (var x = skipRows; x < skipRows + this.filterConfig.pageSize && x - this.skippedRowsInDocs < this.allItems.length; x++) {
                    this.docs.push(this.allItems[x - this.skippedRowsInDocs]);
                }

                this.jsonParams.pag = this.filterConfig.currentPage;
                this.pushNewParams();
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
        buildPagination: function (totalItems) {
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
        firstOrLast: function (pag) {
            if ((this.jsonParams.pag == 1 && pag.pos == "first") || (Math.floor((this.totalItems - 1) / this.filterConfig.pageSize) + 1 == this.jsonParams.pag && pag.pos == "last")) {
                return true;
            } else {
                return false;
            }
        },
    },
};
