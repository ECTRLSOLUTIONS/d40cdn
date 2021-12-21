var d40_utilities = {
    created() {
        // String shortener
        String.prototype.shorten = function(num){
            if (this.length > num) {
                return this.substring(0, num) + "...";
            } else {
                return this;
            }
        };
        
        // String checker
        String.prototype.hasContent = function(){
            return this != "" || this.length > 0;
        };
        
        // Keep before
        String.prototype.keepBefore = function(char){
            return this.split(char)[0];
        };
        
        // Keep after
        String.prototype.keepAfter = function(char){
            return this.split(char)[1];
        };
        
        // Capitalize
        String.prototype.capitalize = function(){
            return this.substring(0, 1).toUpperCase() + this.substring(1);
        };
    },
};
