// String shortener
String.prototype.shorten = (num) => {
    "use strict";
    if (this.length > num) {
        return `${this.substring(0, num)}...`;
    } else {
        return this;
    }
};

// String checker
String.prototype.hasContent = () => {
    "use strict";
    return this != "" || this.length > 0;
};

// Keep before
String.prototype.keepBefore = (char) => {
    "use strict";
    return this.split(char)[0];
};

// Keep after
String.prototype.keepAfter = (char) => {
    "use strict";
    console.log(this);
    return this.split(char)[1];
};

// Capitalize
String.prototype.capitalize = () => {
    "use strict";
    return this.substring(0, 1).toUpperCase() + this.substring(1);
};
