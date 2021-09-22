var d40_wishlist = {
    data: {
        wishlist: [],
    },
    methods: {
        getWishlist() {
            var that = this;

            Liferay.Service(
                "/destinazione.favorite/get-wish-list",
                {
                    groupId: Liferay.ThemeDisplay.getScopeGroupId(),
                    sessionId: String(Liferay.ThemeDisplay.getSessionId()),
                    userId: String(Liferay.ThemeDisplay.getUserId()),
                },
                (res) => {
                    if (that.filterConfig?.debugMode || that.debugMode) {
                        console.log("getWishlist response: ", res);
                    }

                    if (res.success) {
                        res.data.forEach((elem) => {
                            that.wishlist.push(elem);
                        });
                    }
                }
            ).catch((err) => {
                console.error("Error adding to wishlist: ", err);
            });
        },
        setFavourite(elemId) {
            var that = this;

            Liferay.Service(
                "/destinazione.favorite/add-to-wish-list",
                {
                    groupId: Liferay.ThemeDisplay.getScopeGroupId(),
                    sessionId: String(Liferay.ThemeDisplay.getSessionId()),
                    userId: String(Liferay.ThemeDisplay.getUserId()),
                    itemGroupId: 11,
                    itemId: String(elemId),
                },
                (res) => {
                    if (that.filterConfig?.debugMode || that.debugMode) {
                        console.log("addToWishList response: ", res);
                    }

                    if (res.success) {
                        res.data.forEach((elem) => {
                            if (elem.itemId == elemId) {
                                that.wishlist.push(elem);
                            }
                        });
                    }
                }
            ).catch((err) => {
                console.error("Error adding to wishlist: ", err);
            });
        },
        removeFavourite(id) {
            var that = this,
                elemOid = "";

            this.wishlist.forEach((item) => {
                if (item.itemId == id) {
                    elemOid = item._id.$oid;
                }
            });

            Liferay.Service(
                "/destinazione.favorite/delete-item-from-wish-list",
                {
                    oid: elemOid,
                },
                (res) => {
                    if (that.filterConfig?.debugMode || that.debugMode) {
                        console.log("deleteFromWishList response: ", res);
                    }

                    if (res.success) {
                        that.wishlist.forEach((item, index) => {
                            if (item._id.$oid == res.data.document) {
                                that.wishlist.splice(index, 1);
                            }
                        });
                    }
                }
            ).catch((err) => {
                console.error("Error removing from wishlist: ", err);
            });
        },
        isSavedItem(id) {
            return this.wishlist.filter((doc) => {
                return doc.itemId === id;
            })[0];
        },
    },
};
