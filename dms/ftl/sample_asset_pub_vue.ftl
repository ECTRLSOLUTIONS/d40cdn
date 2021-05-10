<#--
ESEMPIO DI ASSET PUBLISHER CON VUE

USA IL jsonFeeds.ftl montato su una configurable alla pagina /jsonfeed

-->




<section id="<@portlet.namespace />_search">
    <div class="container py-5">
        <p class="h3 text-dark mb-4">Componente Asset Publisher con VUE</p>
        <p> consente di utilizzare la GUI di configurazione dell'asset publisher per visualizzare una lista di contenuti tramite app VUE. 
        Ad oggi legge:
        <ul style="list-style:decimal">
        <li> strutturara del web content</li>
        <li> categorie fino a due regole, sia in AND che in OR</li>
        <li> ordinamento, fino a due livelli. Compreso tipo (ascendente o discendente). Per ora usa i campi testo e data delle strutture, il titolo dell'articolo e data 
        ultima modifica</li>
        <li> navigazione circolare: assumendo che
         il contenuto principale nella pagina sia un webcontent visualizzato con un template di articoloproduca una variabile javascript cosi: 
        <code>
&lt;#assign suggestoMkspAPI = serviceLocator.findService(&quot;eu.suggesto.suggestogui.service.SuggestoGuiLocalService&quot;)&gt;
        &lt;#assign groupedCategories=&quot;&quot;&gt;
        &lt;#assign groupedCategories=suggestoMkspAPI.getGroupedArticleCategories(groupId,.vars['reserved-article-id'].data,locale,locale)&gt;
        &lt;script&gt;
        var groupedCategories=<$>{groupedCategories.toString()};
        &lt;/script&gt;
        /* sostituire <$> con $ */
                </code>
        legge le categorie specificate nell'articolo di un certo vocabolario e le usa come filtro, aggiungendole a quanto configurato nell'asset publisher.
        questa demo usa il vocabolario "Area Geografica".
        </li>
        <li>
        usa il jsonfeeds.ftl generato dal template jsonFeeds.ftl di questo repository, sezione jsonFeeds in ftl.
        </li>
        <li> 
        l'esempio mostra anche un semplice filtro. Si può omettere se non serve il filtro.
        </li>
        <li> 
        l'App vue che usa è asset_pub_app di questo repository. Tutti i parametri vengono passati in fondo nella variabile filterConfig.
        </li>
        <li>
        se il tema include i js di base, si possono rimuovere da qui.
        </li>

        </ul>

        
        
        </p>
        <div >
        <#--        questo sotto funziona per tipo filtro select -->
        <#--
        <select v-model="filterConfig.filterGroup[1].selected"  @change="fetchData()">
            <option  value="*">
                Seleziona... 
            </option>
            <option v-for="option in filterConfig.filterGroup[1].categories" :value="option.categoryId" v-if="option.counter !== '(0)'">
                {{option.label}} {{option.counter}}
            </option>
        </select>
        </div>
        -->
        <div >
         <label v-for="category in filterConfig.filterGroup[1].categories" :class="{disabled: category.counter == '(0)'}">
            <input type="checkbox" :value="category.categoryId"  autocomplete="off" v-model="category.selected" @change=" fetchData()" :disabled="category.counter == '(0)'">{{category.label}}
            <span class="badge text-muted">{{category.counter}}</span>
        </label>
        </div>

        <div class="card-deck">
            <div v-for="(item, index) in docs" :key="item.id + '-' + index" class="card bg-dark text-white">
                <img :src="item.contentJSON.previewPicture" class="card-img" :alt="item.contentJSON.title" style="max-height: 300px;">
                <div class="card-img-overlay">
                <a :href="item.contentJSON.viewUrl" class="btn tw-bg-green btn-sm tw-font-heading tw-rounded-lg text-white text-uppercase tw-py-3 px-4"> 
                    <h5 class="card-title">
                        <span class="badge badge-secondary">{{ item.contentJSON.title }}</span>
                    </h5>
                </a>
                </div>
            </div>
        </div>
    </div>
</section>


<#-- utilizza le impostazioni dell'asset publisher per inizializzare il filtro -->

<#-- READ ALL PORTLET PREFERENCES -->

<#assign prefs=renderRequest.getPreferences()>
<#assign names=prefs.getNames()>

<#list names as name>
"${name}",${prefs.getValue(name,"")}<br>
</#list>



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

<#assign numItems=5>
<#assign numItems=prefs.getValue("delta","10")!>


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
        numItems: ${numItems}<br>
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
<script src="https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/adriano/dms/js/asset_pub_app.js"></script>
<#--script src="https://d2m98g73xnllun.cloudfront.net/ECTRLSOLUTIONS/d40cdn/main/dms/js/asset_pub_app.js"></script-->



<#list rootElements?sort_by("description") as item>
    <#if item.name != "Topic">
        <#assign vocabularies += [item]>

    </#if>
</#list>
<#assign prefix = "- ">
<#assign qry = "">
<#-- categorie circolari impostate dalla portlet principale della pagina -->
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
        "pageSize": ${numItems},
        "maxItemInMap": 100,
        "qry": "",
        "so": "",
        "filterGroup": [
            {
                "paramName": "kw",
                "type": "textinput",
                "value": ""
            },
            <#-- se non si usano i filtri, filterGroup può essrere un array vuoto -->
            <#list vocabularies as voc>
                <#-- FILTRO 1 -->
                <#if voc.name == "Area Geografica">
                    {
                        "vocabulary": "${voc.name}",
                        "paramName": "p1",
                        "type": "checkboxes",
                        "selected": "*",
                        "categories": [
                            <#list CategoryService.getVocabularyRootCategories(voc.vocabularyId, -1, -1, null) as cat>
                                <#if (CategoryService.getChildCategoriesCount(cat.categoryId) > 0)>
                                    <#assign prefix = "- ">
                                </#if>
                                {
                                    "categoryId": "${cat.categoryId}",
                                    "label": "${prefix}${cat.name?upper_case}",
                                    <#if cat?index==0>
                                    "selected":true,
                                    </#if>
                                    "index":"${cat?index}",
                                    $isDisabled: false
                                },
                                <#list CategoryService.getChildCategories(cat.categoryId, -1, -1, null) as subCat>
                                {
                                    "categoryId": "${subCat.categoryId}",
                                    "label": "${subCat.name}",
                                    <#if subCat?index==0>
                                    "selected":true,
                                    </#if>
                                    "index":"${subCat?index}",
                                    $isDisabled: false
                                },
                                </#list>
                            </#list>
                        ]
                    },
                </#if>
        </#list>
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