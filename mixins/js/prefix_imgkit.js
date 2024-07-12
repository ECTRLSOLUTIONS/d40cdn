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
        getKitPrefix(img, params = "") {
            var prefix = "https://ik.imagekit.io/suggesto/",
                image = img,
                origin = "";
                
            if(img.includes("https://via.placeholder.com")){
                return img;
            }
            
            if(img.includes("?")){
                image = img.split("?")[0];
            }
            
            if(!img.includes("http://") && !img.includes("https://")){
                //xxx origin = window.location.origin;
                origin = "https://bo-discovertrento.d40.it";
            }

            return prefix + origin + image + "?tr=" + params;
        },
        getKitCtxPrefix(img, ctx,params="") {
            var prefix = "https://ik.imagekit.io/suggesto/"+ctx,
                image = img,
                origin = "";
                
            if(img.includes("https://via.placeholder.com")){
                return img;
            }
            
            if(img.includes("?")){
                image = img.split("?")[0];
            }
            
            return prefix + image + "?tr=" + params;
        }        
    },
};
