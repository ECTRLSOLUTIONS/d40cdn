var d40_crop = {
    methods: {
        getPrefix: function (image, w, h) {
            var prefix = "",
                imgCdn = "https://d28r45jypu6nt9.cloudfront.net/o/d40/img/",
                siteUrl = window.location.origin.replace("://", ".");

            if (imgCdn !== "") {
                if (_.startsWith(image, "http") || image == "/documentsundefined") {
                    if (image == "/documentsundefined") {
                        image = "https://via.placeholder.com/450x300?text=Anteprima";
                    }
                } else {
                    if (typeof h === "string") {
                        prefix = imgCdn + "w_" + w + "/" + siteUrl;
                    } else {
                        prefix = imgCdn + "w_" + w + ",h_" + h + "/" + siteUrl;
                    }
                }
            }

            return prefix + image;
        },
    },
};
