var d40_social = {
    data: {
        socialEndPoint: "https://online.d40.it/web/suggesto-socialfeed/",
        socialParams: "?p_p_id=Configurable&p_p_lifecycle=2&p_p_resource_id=json",
        posts: [],
    },
    methods: {
        getPosts(siteName) {
            var that = this;

            axios
                .get(this.socialEndPoint + siteName + this.socialParams)
                .then((res) => {
                    if (that.filterConfig.debugMode) {
                        console.log("Posts: ", res);
                    }

                    that.posts = res.data.docs;
                })
                .then(() => {
                    if (typeof that.initLazyLoad === "function") {
                        that.initLazyLoad();
                    }
                })
                .catch((err) => {
                    console.error("Error getting posts: ", err);
                })
                .finally(() => {
                    that.loading = false;
                });
        },
    },
};
