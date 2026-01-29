<#--
ESEMPIO DI ASSET PUBLISHER CON VUE

USA IL jsonFeeds.ftl montato su una configurable alla pagina /jsonfeed

-->




<div id="<@portlet.namespace />_search" class="container" v-cloak>
<section   class="pt-4 pt-lg-5">
	<div class="container mt-4 mt-lg-0">
		<div class="sheet border-0 tw-shadow-xl tw-rounded-xl p-4 p-lg-5">
			<div class="row justify-content-center tw--mt-10 lg:tw--mt-20">
				<div class="col-11">
					<div class="d-flex justify-content-center justify-content-lg-start">
						<a href="#" class="btn tw-bg-green font-weight-bold tw-text-sm md:tw-text-3xl tw-font-heading tw-rounded-lg text-white text-uppercase py-3 px-lg-5"> Cosa puoi vedere? </a>
					</div>
				</div>
			</div>

			<div class="tw-divide-y tw-divide-gray-300 tw-space-y-6">
			
			
            <div class="row pt-4" v-for="(item, index) in docs" :key="item.id + '-' + index">

					<div class="col-12">
						<p class="tw-text-black tw-font-heading text-uppercase font-weight-bold mb-3">{{ item.contentJSON.title }}</p>
					</div>
					<div class="col-12 col-lg-5">
						<div class="aspect-ratio aspect-ratio-16-to-9 tw-rounded-xl">
							<img alt="img" class="aspect-ratio-item-fluid w-100 h-100 tw-object-cover" :src="item.contentJSON.previewPicture" />
						</div>
					</div>
					<div class="col-12 col-lg-7">
						<p class="tw-text-lg tw-text-black mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
						<a :href="item.contentJSON.viewUrl" class="btn tw-bg-green btn-sm tw-font-heading tw-rounded-lg text-white text-uppercase tw-py-3 px-4"> Scopri di più </a>
					</div>
            </div>			
			
		
			</div>
		</div>
	</div>
</section>
</div>    



<#-- utilizza le impostazioni dell'asset publisher per inizializzare il filtro -->

<#-- READ ALL PORTLET PREFERENCES -->
<#--
<#list names as name>
"${name}",${prefs.getValue(name,"")}<br>
</#list>
-->
<#assign prefs=renderRequest.getPreferences()>
<#assign names=prefs.getNames()>
<#assign classTypeIds="">
<#assign structureKey="">
<#assign classTypeIds=prefs.getValue("classTypeIds","")!>
<#assign classTypeIds=prefs.getValue("classTypeIds","")!>
<#if classTypeIds?has_content>
    <#assign structureKey=classTypeIds?number-1 !>
</#if>
<#assign orderByColumn1=prefs.getValue("orderByColumn1","")!>
<#assign orderByType1=prefs.getValue("orderByType1","")!>
<#assign orderByColumn2=prefs.getValue("orderByColumn2","")!>
<#assign orderByType2=prefs.getValue("orderByType2","")!>
<#assign f0=prefs.getValue("queryValues0","")>
<#assign queryValues0=prefs.getValues("queryValues0",null) !>
<#if queryValues0?has_content>
    <#assign f0="">
    <#list queryValues0 as qv0>
        <#if f0?has_content>
            <#assign f0=f0+ ", ">
        </#if>
        <#assign f0=f0+qv0>
    </#list>
</#if>
<#assign queryAndOperator0=prefs.getValue("queryAndOperator0","")>
<#assign f1=prefs.getValue("queryValues1","")>
<#assign queryValues1=prefs.getValues("queryValues1",null) !>
<#if queryValues1?has_content>
    <#assign f1="">
    <#list queryValues1 as qv1>
        <#if f1?has_content>
            <#assign f1=f1 + ", ">
        </#if>
        <#assign f1=f1+qv1>
    </#list>
</#if>
<#assign queryAndOperator1=prefs.getValue("queryAndOperator1","")>



    <div style="display:none">
        classTypeIds:${classTypeIds} <br>
        structureKey:${structureKey} <br>
        f0:${f0} <br>
        queryAndOperator0:${queryAndOperator0} <br>
        f1:${f1} <br>
        queryAndOperator1:${queryAndOperator1} <br>
        orderByColumn1: ${orderByColumn1} <br>
        orderByType1: ${orderByType1} <br>
        orderByColumn2: ${orderByColumn2}<br>
        orderByType2: ${orderByType2} <br>
    </div>

</div>

<#assign
    VocabularyService = serviceLocator.findService("com.liferay.asset.kernel.service.AssetVocabularyLocalService")
    CategoryService = serviceLocator.findService("com.liferay.asset.kernel.service.AssetCategoryLocalService")
    rootElements = VocabularyService.getCompanyVocabularies(themeDisplay.getCompanyId())
    vocabularies = []
>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment-with-locales.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-moment-lib@1.2.2/dist/vue-moment-lib.umd.min.js"></script>
<script src="https://unpkg.com/v-calendar@1.0.1/lib/v-calendar.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-multiselect/2.1.6/vue-multiselect.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.5/js/swiper.min.js"></script>
<#--script src="https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/adriano/dms/js/asset_pub_app.js"></script-->
<script src="https://d2m98g73xnllun.cloudfront.net/ECTRLSOLUTIONS/d40cdn/main/dms/js/asset_pub_app.js"></script>



<#list rootElements?sort_by("description") as item>
    <#if item.name != "Topic">
        <#assign vocabularies += [item]>

    </#if>
</#list>
<#assign prefix = "- ">
<#assign qry = "">

<script>
    var circularCategories=[];
    if(typeof groupedCategories!=="undefined") {
        for(var i=0;i<groupedCategories.length;i++) {
        console.log(groupedCategories[i]);
            if(groupedCategories[i].vocabularyName==="Area Geografica")
            for(var j=0;j<groupedCategories[i].categories.length;j++) {
            console.log(groupedCategories[i].categories[j].categoryId);
                circularCategories.push(groupedCategories[i].categories[j].categoryId)
            }
        }

        var c1="";
        for (var i=0;i<circularCategories.length;i=i+1) {
            if(i>0)
            c1=c1+", ";
            c1=c1 + circularCategories[i];
        }
    }
    var <@portlet.namespace />_filterConfig = {
        "c1":c1,
        "structureKey":"${structureKey}",
        "f0":"${f0}",
        "f1":"${f1}",
        "queryAndOperator0":"${queryAndOperator0}",
        "queryAndOperator1":"${queryAndOperator1}",
        "queryAndOperatorC1":"false",
        "orderByColumn1":"${orderByColumn1}",
        "orderByType1":"${orderByType1}",
        "orderByColumn2":"${orderByColumn2}",
        "orderByType2":"${orderByType2}",
        "endPoint": "/jsonfeed?p_p_id=Configurable&p_p_lifecycle=2&p_p_resource_id=json&_Configurable_jsonParams=",
        "pageSize": 5,
        "maxItemInMap": 100,
        "qry": "",
        "so": "",
        "filterGroup": [
            {
                "paramName": "kw",
                "type": "textinput",
                "value": ""
            },
            <#list vocabularies as voc>
                <#-- FILTRO 1 -->
                <#if voc.name == "Region">
                    {
                        "vocabulary": "${voc.name}",
                        "paramName": "p1",
                        "type": "multiselect",
                        "selected": circularCategories,
                        "categories": [
                            <#list CategoryService.getVocabularyRootCategories(voc.vocabularyId, -1, -1, null) as cat>
                                <#if (CategoryService.getChildCategoriesCount(cat.categoryId) > 0)>
                                    <#assign prefix = "- ">
                                </#if>
                                {
                                    "categoryId": "${cat.categoryId}",
                                    "label": "${prefix}${cat.name?upper_case}",
                                    $isDisabled: false
                                },
                                <#list CategoryService.getChildCategories(cat.categoryId, -1, -1, null) as subCat>
                                {
                                    "categoryId": "${subCat.categoryId}",
                                    "label": "${subCat.name}",
                                    $isDisabled: false
                                },
                                </#list>
                            </#list>
                        ]
                    },
                </#if>
                
                <#-- FILTRO 2 -->
                <#if voc.name == "Tipo di viaggiatore">
                    {
                        "vocabulary": "${voc.name}",
                        "paramName": "p2",
                        "type": "multiselect",
                        "selected": [],
                        "categories": [
                            <#list CategoryService.getVocabularyRootCategories(voc.vocabularyId, -1, -1, null) as cat>
                                {
                                    "categoryId": "${cat.categoryId}",
                                    "label": "${cat.name}",
                                    $isDisabled: false
                                },
                            </#list>
                        ]
                    },
                </#if>
                
                <#-- FILTRO 3 -->
                <#if voc.name == "Area geografica">
                    {
                        "vocabulary": "${voc.name}",
                        "paramName": "p3",
                        "type": "multiselect",
                        "selected": [],
                        "categories": [
                            <#list CategoryService.getVocabularyRootCategories(voc.vocabularyId, -1, -1, null)?sort_by("name") as cat>
                                <#if (CategoryService.getChildCategoriesCount(cat.categoryId) > 0)>
                                    <#assign prefix = "- ">
                                </#if>
                                {
                                    "categoryId": "${cat.categoryId}",
                                    "label": "${prefix}${cat.name?upper_case}",
                                    $isDisabled: false
                                },
                                <#list CategoryService.getChildCategories(cat.categoryId, -1, -1, null)?sort_by("name") as subCat>
                                {
                                    "categoryId": "${subCat.categoryId}",
                                    "label": "${subCat.name}",
                                    $isDisabled: false
                                },
                                </#list>
                            </#list>
                        ]
                    },
                </#if>
                
                <#-- FILTRO 4 -->
                <#if voc.name == "Tipo di sistemazione (soggiorni studio)">
                    {
                        "vocabulary": "${voc.name}",
                        "paramName": "p4",
                        "type": "multiselect",
                        "selected": [],
                        "categories": [
                            <#list CategoryService.getVocabularyRootCategories(voc.vocabularyId, -1, -1, null) as cat>
                                {
                                    "categoryId": "${cat.categoryId}",
                                    "label": "${cat.name}",
                                    $isDisabled: false
                                },
                            </#list>
                        ]
                    },
                </#if>
            </#list>
            
            <#-- FILTRO 5 -->
            {
                "paramName": "p5",
                "type": "multiselect",
                "selected": [],
                "categories": [
                    {
                        "categoryId": "1",
                        "label": "Si",
                        $isDisabled: false
                    },
                    {
                        "categoryId": "0",
                        "label": "No",
                        $isDisabled: false
                    }
                ]
            },
            {
                "paramName": "d1",
                "type": "datainput",
                "value": ""
            },
            {
                "paramName": "d2",
                "type": "datainput",
                "value": ""
            },
        ],
        imgWidth: 350,
        imgHeight: 220,
        imgDef: "https://via.placeholder.com/500x300"
    };
    
 document.addEventListener("DOMContentLoaded", function (){
    var <@portlet.namespace />_filterSearch = initAssetPubApp(
        "#<@portlet.namespace />_search",'<@portlet.namespace />','<@portlet.namespace />',
        <@portlet.namespace />_filterConfig
    );
    });
</script>