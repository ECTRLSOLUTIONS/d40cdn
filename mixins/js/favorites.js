var d40_favorites = {
    data: {
        favorites: [],
    },
    mounted() {
        this.getFavorites();
    },
    methods: {
        getFavorites() {
            if (localStorage.getItem("favorites") !== null) {
                this.favorites = JSON.parse(localStorage.getItem("favorites"));
            } else {
                this.favorites = [];
            }
        },
        setFavorite(item) {
            this.getFavorites();

            var newFavorite = {
                id: item.id,
                contentJSON: {
                    title: item.contentJSON.title,
                    previewDescription: item.contentJSON.previewDescription,
                    description: item.contentJSON.description,
                    geoRef: item.contentJSON.geoRef,
                    previewPicture: item.contentJSON.previewPicture,
                    viewUrl: item.contentJSON.viewUrl,
                },
            };

            this.favorites.push(newFavorite);
            this.saveFavorites();
        },
        removeFavorite(item) {
            this.favorites = this.favorites.filter((obj) => obj.id !== item.id);
            this.saveFavorites();
        },
        isFavorite(itemId) {
            if (this.favorites.some((e) => e.id == itemId)) {
                return true;
            }

            return false;
        },
        saveFavorites() {
            localStorage.setItem("favorites", JSON.stringify(this.favorites));
            if (this.filterConfig.debugMode) {
                console.log("favorites updated");
            }
        },
        resetAllFavorites() {
            if (confirm("delete all favorites?")) {
                localStorage.removeItem("favorites");
                if (this.filterConfig.debugMode) {
                    console.log("removed all favorites");
                }

                this.getFavorites();
            }
        },
    },
};
