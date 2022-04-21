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
					type: "lfr",
				},
			};

			this.favorites.push(newFavorite);
			this.saveFavorites();
		},
		setYuccaFavorite(item) {
			this.getFavorites();

			var newFavorite = {
				id: item.id,
				contentJSON: {
					title: item.denominazione,
					previewDescription: "",
					assetCategoryIds: item.assetCategoryIds,
					description: "",
					geoRef: ["", ""],
					previewPicture: "https://via.placeholder.com/500",
					viewUrl: item.www,
					type: "yucca",
				},
			};

			this.favorites.push(newFavorite);
			this.saveFavorites();
		},
		setADTFavorite(itemId, itemTitle, itemPreviewDescription, itemDescription, itemGeoRef, itemPreviewPicture, itemUrl) {
			this.getFavorites();

			var newFavorite = {
				id: itemId,
				contentJSON: {
					title: itemTitle,
					previewDescription: itemPreviewDescription,
					description: itemDescription,
					geoRef: itemGeoRef,
					previewPicture: itemPreviewPicture,
					viewUrl: itemUrl,
					type: "lfr",
				},
			};

			this.favorites.push(newFavorite);
			this.saveFavorites();
		},
		removeFavorite(itemId) {
			this.favorites = this.favorites.filter((obj) => obj.id !== itemId);
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
			if (this.filterConfig?.debugMode || this.debugMode) {
				console.log("favorites updated");
			}
		},
		resetAllFavorites() {
			if (confirm("delete all favorites?")) {
				localStorage.removeItem("favorites");
				if (this.filterConfig?.debugMode || this.debugMode) {
					console.log("removed all favorites");
				}

				this.getFavorites();
			}
		},
	},
};
