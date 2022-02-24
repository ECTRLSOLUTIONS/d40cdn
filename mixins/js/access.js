var d40_access = {
    data: {
        firstName: "",
        lastName: "",
        email: "",
        emailConfirmation: "",
        password: "",
        passwordConfirmation: "",
        languageCountryId: -1,
        taxCode: "",
        agreedToTermsOfUse: false,
        agreedToPrivacyPolicy: false,
        agreedNewsletter: false,
        joinExistingOrganization: false,
        organizationId: "",
        organizationName: "",
        ticketKey: "",
    },
    computed: {
        isMailValid() {
            const mailValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
            return mailValid.test(this.email);
        },
        isPasswordValid() {
            return this.password == this.passwordConfirmation;
        },
        isDataValid() {
            return this.agreedToTermsOfUse && this.agreedToPrivacyPolicy && this.password.length > 5 && this.firstName.length > 0 && this.lastName.length > 0 && this.isMailValid;
        },
    },
    methods: {
        signupUser() {
            Liferay.Service(
                "/destinazione.d40user/signup-user",
                {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    emailConfirmation: this.emailConfirmation,
                    password: this.password,
                    passwordConfirmation: this.passwordConfirmation,
                    languageCountryId: this.languageCountryId,
                    taxCode: this.taxCode,
                    agreedToTermsOfUse: this.agreedToTermsOfUse,
                    agreedToPrivacyPolicy: this.agreedToPrivacyPolicy,
                    agreedNewsletter: this.agreedNewsletter,
                },
                (res) => {
                    console.log("signupUser res: ", res);
                }
            );
        },
        signupUserMin() {
            var that = this;

            Liferay.Service(
                "/destinazione.d40user/signup-user",
                {
                    firstName: this.email,
                    lastName: this.email,
                    email: this.email,
                    emailConfirmation: this.email,
                    password: this.password,
                    passwordConfirmation: this.password,
                    languageCountryId: this.languageCountryId,
                    taxCode: this.taxCode,
                    agreedToTermsOfUse: this.agreedToTermsOfUse,
                    agreedToPrivacyPolicy: this.agreedToPrivacyPolicy,
                    agreedNewsletter: this.agreedNewsletter,
                },
                (res) => {
                    console.log("signupUserMin res:", res);

                    if (res.success) {
                        console.log("calling signin");
                        return that.signin();
                    }
                }
            );
        },
        verifyEmailAddress() {
            Liferay.Service(
                "/destinazione.d40user/verify-email-address",
                {
                    ticketKey: this.ticketKey,
                },
                function (res) {
                    console.log("verifyEmailAddress res: ", res);
                    location.reload();
                }
            );
        },
        createOrganization() {
            Liferay.Service(
                "/destinazione.d40user/create-organization",
                {
                    organizationName: this.organizationName,
                },
                function (res) {
                    console.log("createOrganization res: ", res);
                }
            );
        },
        signin() {
            if (this.$refs.form) {
                this.$refs.form.submit();
            }

            return false;
        },
    },
};
