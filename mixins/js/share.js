var d40_share = {
    methods: {
        share: function (title, desc) {
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
                        this.legacyShare();
                    }
                }
            } else {
                this.legacyShare();
            }
        },
        legacyShare: function () {
            var clip = document.createElement("input"),
                toCopy = window.location.href;

            document.body.appendChild(clip);
            clip.value = toCopy;
            clip.select();
            document.execCommand("copy");
            document.body.removeChild(clip);
        },
    },
};
