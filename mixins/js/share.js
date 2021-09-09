var d40_share = {
    methods: {
        share: function (title, desc, mode = "legacy") {
            if (Liferay.Browser.isMobile()) {
                if (Liferay.Browser.isIphone() || Liferay.Browser.isChrome() || Liferay.Browser.isOpera()) {
                    var shareData = {
                        title: title,
                        text: desc,
                        url: window.location.href,
                    };

                    try {
                        navigator.share(shareData);
                    } catch (err) {
                        console.log("Error sharing: " + err);

                        if (mode == "legacy") {
                            this.legacyShare();
                        } else if (mode == "social") {
                            this.socialShare(title, desc);
                        }
                    }
                }
            } else {
                if (mode == "legacy") {
                    this.legacyShare();
                } else if (mode == "social") {
                    this.socialShare(title, desc);
                }
            }
        },
        legacyShare: function () {
            var clip = document.createElement("input"),
                toCopy = window.location.href;

            document.body.appendChild(clip);
            clip.value = toCopy;
            clip.select();
            clip.setSelectionRange(0, 999999);

            navigator.clipboard.writeText(clip.value);
            //document.execCommand("copy");
            document.body.removeChild(clip);

            alert("Link copiato");
        },
        socialShare: function (title, desc, image = "") {
            var link = "#",
                params = "",
                winHeight = 450,
                winWidth = 600,
                winTop = window.screen.height / 2 - winHeight / 2,
                winLeft = window.screen.width / 2 - winWidth / 2,
                params = "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=" + winWidth + ",height=" + winHeight + ",left=" + winLeft + ",top=" + winTop;

            link = "http://www.facebook.com/sharer.php?s=100&p[title]=" + encodeURIComponent(title) + "&p[summary]=" + encodeURIComponent(desc) + "&p[url]=" + window.location.href + "&p[images][0]=" + image;

            window.open(link, "Facebook", params);
        },
    },
};
