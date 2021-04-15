var d40_wishlist = {
    data: {
        wishlist: [],
    },
    methods: {
        getWishlist: function () {
            var that = this;

            Liferay.Service(
                "/destinazione.favorite/get-wish-list",
                {
                    groupId: Liferay.ThemeDisplay.getScopeGroupId(),
                    sessionId: String(Liferay.ThemeDisplay.getSessionId()),
                    userId: String(Liferay.ThemeDisplay.getUserId()),
                },
                function (res) {
                    console.log("getWishlist response: ", res);

                    if (res.success) {
                        res.data.forEach(function (elem) {
                            that.wishlist.push(elem);
                        });
                    }
                }
            ).catch(function (err) {
                console.log("Error adding to wishlist: ", err);
            });
        },
        setFavourite: function (elemId) {
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
                function (res) {
                    console.log("addToWishList response: ", res);

                    if (res.success) {
                        res.data.forEach(function (elem) {
                            if (elem.itemId == elemId) {
                                that.wishlist.push(elem);
                            }
                        });
                    }
                }
            ).catch(function (err) {
                console.error("Error adding to wishlist: ", err);
            });
        },
        removeFavourite: function (id) {
            var that = this,
                elemOid = "";

            this.wishlist.forEach(function (item) {
                if (item.itemId == id) {
                    elemOid = item._id.$oid;
                }
            });

            Liferay.Service(
                "/destinazione.favorite/delete-item-from-wish-list",
                {
                    oid: elemOid,
                },
                function (res) {
                    console.log("deleteFromWishList response: ", res);

                    if (res.success) {
                        that.wishlist.forEach(function (item, index) {
                            if (item._id.$oid == res.data.document) {
                                that.wishlist.splice(index, 1);
                            }
                        });
                    }
                }
            ).catch(function (err) {
                console.error("Error removing from wishlist: ", err);
            });
        },
        isSavedItem: function (id) {
            return this.wishlist.filter(function (doc) {
                return doc.itemId === id;
            })[0];
        },
    },
};
