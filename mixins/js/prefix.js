var d40_crop = {
    methods: {
        getPrefix(image, w, h = "") {
            var prefix = "",
                imgCdn = "https://d28r45jypu6nt9.cloudfront.net/o/d40/img/",
                siteUrl = window.location.origin.replace("://", ".");

            if (image == "") {
                h == "" ? (image = `https://via.placeholder.com/${w}?text=Anteprima`) : (image = `https://via.placeholder.com/${w}x${h}?text=Anteprima`);
            } else {
                if (image.startsWith("http") || image == "/documentsundefined") {
                    image == "/documentsundefined" ? (image = `https://via.placeholder.com/${w}x${h}?text=Anteprima`) : "";
                } else {
                    h == "" ? (prefix = imgCdn + "w_" + w + "/" + siteUrl) : (prefix = imgCdn + "w_" + w + ",h_" + h + "/" + siteUrl);
                }
            }

            return prefix + image;
        },
    },
};
