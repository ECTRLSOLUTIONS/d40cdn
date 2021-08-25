var d40_crop = {
    methods: {
        getPrefix: function (image, w, h = "") {
            var prefix = "",
                imgCdn = "https://d28r45jypu6nt9.cloudfront.net/o/d40/img/",
                siteUrl = window.location.origin.replace("://", ".");

            if (image == "") {
                if (h == "") {
                    h = w;
                }

                image = `https://via.placeholder.com/${w}x${h}?text=Anteprima`;
            } else {
                if (image.startsWith("http") || image == "/documentsundefined") {
                    if (image == "/documentsundefined") {
                        image = `https://via.placeholder.com/${w}x${h}?text=Anteprima`;
                    }
                } else {
                    if (h == "") {
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
