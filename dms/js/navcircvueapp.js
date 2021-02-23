/* ver 1.7 */
function initCircNavVueApp(divApp,myPortletId,myPortletNamespace,jsonParams,endPoint,pageSize) {
    console.log(jsonParams +"test");

    
    var CircNavVueApp = new Vue({
        el: divApp,
        data: {
            allItems: [],
            docs: [],
            jsonParams: jsonParams,
            totalItems: 0,
            loading: true,
            signedIn: Liferay.ThemeDisplay.isSignedIn(),
            toastText: "",
            endPoint:endPoint,
            pageSize:pageSize
        },
        created() {
            this.fetchData();
        },
        methods: {
            showMore: function(num){
                var that = this,
                    itemsToShow = this.docs.length + num;
                
                this.docs = [];
                
                this.allItems.forEach(function(item, index){
                    if(index < itemsToShow){
                        that.docs.push(item);
                    }
                });
            },
            hasOther: function(item){
                var res = false;
                
                if(item.date.length > 1){
                    res = true;
                }
                
                return res;
            },
            seeMore: function(){
                sessionStorage.setItem("seeMore", true);
            },
            fetchData: function(){
                console.log("Fetching data...");
                
                var that = this;
                var i, j, k, l;
                this.loading = true;
                url = this.endPoint + JSON.stringify(this.jsonParams);
                this.jsonParams.num = this.pageSize;
                console.log(this.jsonParams);
                axios.get(
                    url
                ).then(function(response){
                    console.log("Data fetched, result: ", response.data);
                    if(typeof(response.data.docs) !== "undefined"){
                       response.data.docs.forEach(function(item, index){
                            if(index < that.pageSize){
                                that.docs.push(item);
                            }
                        });
                        var allDocs = response.data.docs;
                        var hashItems = {};
                        that.allItems = [];
                        allDocs.forEach(function(item, index){
                            that.allItems.push(item);
                        });
                        that.docs = [];
                        that.allItems.forEach(function(item, index){
                            if(index < that.pageSize){
                                that.docs.push(item);
                            }
                        });
                           
                    }else{
                        that.docs = [];
                        that.totalItems = 0;
                    }
                    if(typeof(response.data.metadata) !== "undefined"){
                        //that.totalItems = response.data.metadata.numFound;
                        that.totalItems=that.allItems.length;
                        console.log("totalItems: ", that.totalItems);
                    }else{
                        that.totalItems = 0;
                    }
    
                    that.loading = false;
                }).catch(function(e){
                    console.log("error here: ", e);
                    that.totalItems = 0;
                    that.loading = false;
                }).finally(function(){
                });
            },
            showToast: function(text){
                this.toastText = text;
                document.getElementById("toast").classList.add("show");
                
                var that = this;
                setTimeout(function(){
                    document.getElementById("toast").classList.remove("show");
                    that.toastText = "";
                }, 3000);
            },
            getPrefix: function(image, w, h){
                var prefix = "",
                    imgCdn = "https://d28r45jypu6nt9.cloudfront.net/o/d40/img/",
                    siteUrl = "${themeDisplay.getURLPortal()?replace('://', '.')}";
                
                if(imgCdn !== ""){
                    var baseUrl = imgCdn,
                        width = w,
                        height = h;
                    
                    if(_.startsWith(image, "http") || image == "/documentsundefined"){
                        prefix = "";
                        
                        if(image == "/documentsundefined"){
                            image = "https://via.placeholder.com/450x300?text=Anteprima";
                        }
                    }else{
                        if(typeof(h) === "string"){
                            prefix = baseUrl + "w_" + width + "/" + siteUrl;
                        }else{
                            prefix = baseUrl + "w_" + width + ",h_" + height + "/" + siteUrl;
                        }
                    }
                }
                
                return prefix + image;
            },
            sendToAccess: function(){
                window.location.href = window.location.origin + "/login";
            }
        }
    });
    return CircNavVueApp;
}   
