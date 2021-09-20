var d40_lazyload = {
    methods: {
        initLazyLoad(container = "") {
            if ("loading" in HTMLImageElement.prototype) {
                const images = document.querySelectorAll(container + ' img[loading="lazy"]');
                images.forEach((img) => {
                    img.src = img.dataset.src;
                });
            } else {
                const fallbackScript = document.createElement("script");
                fallbackScript.async = true;
                fallbackScript.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.0/lazysizes.min.js";
                document.body.appendChild(fallbackScript);
            }
        },
    },
};
