var d40_newsletter = {
    data: {
        newsletters: [],
        selectedNewsletters: [],
        acceptedConditions: false,
        email: "",
        emailError: false,
        emailChecker: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    },
    computed: {
        selectionValid: function () {
            return this.selectedNewsletters.length > 0;
        },
    },
    methods: {
        loadNewsletters(newsletters) {
            var that = this;
            newsletters.forEach((newsletter) => {
                if (!newsletter.name.startsWith("priv")) {
                    that.newsletters.push(newsletter);
                }
            });

            if (this.newsletters.length > 0) {
                this.selectedNewsletters.push(this.newsletters[0].id);
            }
        },
        validateForm(e) {
            if (this.emailChecker.test(this.email)) {
                return true;
            }

            this.emailError = true;
            e.preventDefault();
        },
    },
};
