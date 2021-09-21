var d40_shortener = {
    methods: {
        shortString(str, num = 150) {
            if (str.length > num) {
                return `${str.substring(0, num)}...`;
            } else {
                return str;
            }
        },
    },
};
