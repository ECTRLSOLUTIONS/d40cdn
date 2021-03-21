<#--
    eCTRL Solutions
    EROGATORE jsonFeeds
    ver: 1.8.2 
    data: 27/09/2017

    DEBUG
    Freemarker online: http://freemarker-online.kenshoo.com/
 
  -->

  <#compress>
  <#setting url_escaping_charset="UTF-8">
    <#assign SuggestoMarketspaceAPI = serviceLocator.findService("eu.suggesto.marketspace.service.SmkspDataLocalService")>
    <#assign suggestoMkspAPI = serviceLocator.findService("eu.suggesto.suggestogui.service.SuggestoGuiLocalService")>
    <#assign SuggestoRecommenderServiceAPI = serviceLocator.findService("eu.suggesto.servicecs.service.SuggestoRecommenderLocalService")>
    <#assign SuggestoCSServiceAPI = serviceLocator.findService("eu.suggesto.servicecs.service.SuggestoCSLocalService")>
  <#assign d40Service = serviceLocator.findService("eu.suggesto.d40.builder.d40.service.TourismItemLocalService")>
    <#assign dlFileEntryService = serviceLocator.findService("com.liferay.document.library.kernel.service.DLFileEntryLocalService")>
    <#assign journalServiceAPI = serviceLocator.findService("com.liferay.journal.service.JournalArticleLocalService") />


  <#assign ddmStructureKey = "*" >

  <#assign JSONFactoryUtil = staticUtil["com.liferay.portal.kernel.json.JSONFactoryUtil"]>
  <#assign serviceName = "esd40" >
  <#assign serverName="">
  <#assign srvGroupId = groupId?string >
  <#assign defLng = "it_IT" >
  <#assign numPag = 1 >
  <#assign numItems = 10 >
  <#assign szJsonParams = result.getNamespacedParameters().getString("jsonParams") >    
  <#if szJsonParams != "">
      <#assign jsonParams = jsonFactoryUtil.createJSONObject(szJsonParams) >
  <#else>
      <#assign jsonParams = jsonFactoryUtil.createJSONObject() >
  </#if>
  <#if jsonParams.getString("pag")?has_content>
      <#assign numPag = jsonParams.getString("pag")?number >
  </#if>

  <#if jsonParams.getString("num")?has_content>
  <#assign numItems = jsonParams.getString("num")?number >
  </#if>
  <#assign query = jsonParams.getString("qry") >
  <#assign uid = jsonParams.getString("uid") >
  <#assign kw = jsonParams.getString("kw") >
  <#assign p1 = jsonParams.getString("p1") >
  <#assign p2 = jsonParams.getString("p2","") >
  <#assign p3 = jsonParams.getString("p3","") >
  <#assign p4 = jsonParams.getString("p4","") >
  <#assign p5 = jsonParams.getString("p5","") >
  <#assign p6 = jsonParams.getString("p6","") >
  <#assign p7 = jsonParams.getString("p7","") >
  <#assign p8 = jsonParams.getString("p8","") >
  <#assign p9 = jsonParams.getString("p9","") >
  <#assign p10 = jsonParams.getString("p10","") >
  <#assign p11 = jsonParams.getString("p11","") >
  <#assign sortOrder = jsonParams.getString("so","title_sortable asc") >
  <#assign mode = jsonParams.getString("mode","") >
  <#-- pt  specifica ordinamento distanza, sovrascrive il sortOrder-->
  <#assign pt = jsonParams.getString("pt") >
  <#-- ptflt e dist specificano un filtro per distanza -->
  <#assign ptflt = jsonParams.getString("ptflt") >
  <#assign dist = jsonParams.getString("d","1") >
  <#assign lng = jsonParams.getString("lng","it_IT") >
  <#assign fields = jsonParams.getString("flds","*") >
  <#assign varjs = jsonParams.getString("varjs","isct") >
  <#assign skipItems = (numPag-1)*numItems >

  <#assign structureKey = jsonParams.getString("structureKey") >
  <#assign f0 = jsonParams.getString("f0","") >
  <#assign f1 = jsonParams.getString("f1","") >
  <#assign c1 = jsonParams.getString("c1","") >
  <#assign queryAndOperatorC1 = jsonParams.getString("queryAndOperatorC1","") >
  <#assign queryAndOperator0 = jsonParams.getString("queryAndOperator0","") >
  <#assign queryAndOperator1 = jsonParams.getString("queryAndOperator1","") >
  <#assign orderByColumn1 = jsonParams.getString("orderByColumn1","") >
  <#assign orderByType1 = jsonParams.getString("orderByType1","") >
  <#assign orderByColumn2 = jsonParams.getString("orderByColumn2","") >
  <#assign orderByType2 = jsonParams.getString("orderByType2","") >
  <#if orderByColumn1=="title">
  <#assign orderByColumn1="localized_title_it_IT_sortable">
  </#if>
  <#if orderByColumn1=="modifiedDate">
  <#assign orderByColumn1="modified_sortable">
  </#if>

  <#if orderByColumn1?starts_with("ddm__keyword")>
  <#assign orderByColumn1=orderByColumn1+"_it_IT_String_sortable">
  </#if>

  
  <#if orderByColumn2=="title">
  <#assign orderByColumn2="localized_title_it_IT_sortable">
  </#if>
  <#if orderByColumn2=="modifiedDate">
  <#assign orderByColumn2="modified_sortable">
  </#if>
    <#if orderByColumn2?starts_with("ddm__keyword")> 
  <#assign orderByColumn2=orderByColumn2+"_it_IT_String_sortable">
  </#if>



  <#assign locDef=localeUtil.fromLanguageId("it_IT")>
  <#assign today=dateUtil.parseDate(.now?string('dd')+"/"+.now?string('MM')+"/"+.now?string('yyyy'),locDef) >
  <#assign todayLong=today?long>
  <#if structureKey?has_content>
       <#assign querySlr = "head:true AND status:0 AND ddmStructureKey:${structureKey}">
       <#if f0?has_content>
            <#if queryAndOperator0=="true">
                  <#assign f0Cats= getAndorOrParam(f0, "AND","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:(" + f0Cats + ")">
            <#else>
                  <#assign f0Cats= getAndorOrParam(f0, "OR","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:( " + f0Cats +")">
            </#if>
       </#if>
       <#if f1?has_content>
            <#if queryAndOperator1=="true">
                  <#assign f1Cats= getAndorOrParam(f1, "AND","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:(" + f1Cats+")">
            <#else>
                  <#assign f1Cats= getAndorOrParam(f1, "OR","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:(" + f1Cats +")">
            </#if>
       </#if>
       <#if c1?has_content>
            <#if queryAndOperatorC1=="true">
                  <#assign c1Cats= getAndorOrParam(c1, "AND","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:(" + c1Cats+")">
            <#else>
                  <#assign c1Cats= getAndorOrParam(c1, "OR","") >
                  <#assign querySlr = querySlr + " AND assetCategoryIds:(" + c1Cats +")">
            </#if>
       </#if>
  <#else>
       <#assign querySlr = "head:true AND status:0 AND ddmStructureKey:${ddmStructureKey}">
  </#if>
  <#assign jsort=JSONFactoryUtil.createJSONArray()>
  <#if orderByColumn1?has_content>
    <#assign jsort1=JSONFactoryUtil.createJSONObject()>
    <#assign z=jsort1.put(orderByColumn1,orderByType1)>
    <#assign z=jsort.put(jsort1)>
  </#if>
  <#if orderByColumn2?has_content>
    <#assign jsort2=JSONFactoryUtil.createJSONObject()>
    <#assign z=jsort2.put(orderByColumn2,orderByType2)>
    <#assign z=jsort.put(jsort2)>
  </#if>
  <#assign sortOrder =jsort.toString()>

  <#assign locLng=localeUtil.fromLanguageId(lng)>
  <#assign locDef=localeUtil.fromLanguageId("it_IT")>
  <#assign assetCategoryIds= getAndorOrParam(p1, "OR","") >
  <#if assetCategoryIds !="">
      <#assign qAssetCategoryIds="assetCategoryIds:(${assetCategoryIds})">
      <#assign facetStates = '[{"q":"${qAssetCategoryIds}","f":"assetCategoryIds","a":"p1","r":true}]'>
  <#else>
      <#assign facetStates = '[]'>
  </#if>

  <#--
  public JSONObject getRecommendations(java.lang.String groupId,
              java.lang.String serviceName, java.lang.String context, java.lang.String collection,
              java.lang.String query, String filter, String fields, java.lang.String sort,
              Integer skipRows, Integer numberOfItems, java.lang.String facetStates) {
  -->            
    <#assign resultQry = SuggestoRecommenderServiceAPI.getRecommendations("0",serviceName,"{\"language\":\"${lng}\",\"defaultLanguage\":\"${lng}\"}","",querySlr,filter,fields,sortOrder,skipItems,numItems,facetStates)>
    <#if ! (resultQry.getJSONObject("data")?has_content && resultQry.getJSONObject("data").getJSONObject("response")?has_content && resultQry.getJSONObject("data").getJSONObject("response").getString("numFound")?has_content)>
    
    <#else>
        <#assign numFound =resultQry.getJSONObject("data").getJSONObject("response").getString("numFound")?number>
        <#assign start =resultQry.getJSONObject("data").getJSONObject("response").getString("start")?number>
        <#if numFound gt 0>
            <@writeItems/>
        <#else>  
            {"metadata":{"numFound":${numFound}},
            "query":"${querySlr}"
            }
        </#if>  
    </#if>
  <#macro writeItems>
      <#assign start =resultQry.getJSONObject("data").getJSONObject("response").getString("start")>
      <#assign items =resultQry.getJSONObject("data").getJSONObject("response").getJSONArray("docs")>
      <#assign facets =resultQry.getJSONObject("data").getJSONObject("facetValues")>
      {
        "metadata":{"numFound":${numFound},"start":${start},"querySlr":"${querySlr}","c1":"${c1}","orderByColumn1":"${orderByColumn1}","orderByType1":"${orderByType1}",
        "sortOrder":"${sortOrder?js_string}"},
        "docs":[
            <#list 0..items.length()-1 as i>
            <#assign doc = items.getJSONObject(i)>
            <@jsonoutput />
            <#if i !=items.length()-1>,</#if>
            </#list>
        ],
        "facetedValues":${facets.toString()}
      }
  </#macro>

  <#macro jsonoutput>
      <#assign articleId=getLngStringFromJsonObject(doc,"articleId",lng,defLng,'')>
      <#assign doc = jsonFactoryUtil.createJSONObject() >
      <#assign article=d40Service.getByLng(groupId,"",articleId,lng)>
      <#if article.getBoolean("success")>
      <#assign contentJSON=article.getJSONObject("data").getJSONObject("contentJSON")>
      <#assign viewUrl = suggestoMkspAPI.getArticleUrl(groupId,"", articleId,reqLocale,defLocale,'/det')>
      <#assign z=contentJSON.put("viewUrl",viewUrl)>

      <#assign z=replaceStringWithJSONObject(contentJSON,"geoRef")>
  <#-- sostituisco previewMediaItem che può essere multiplo -->
        <#if contentJSON.getString("previewPicture")?has_content>
            <#assign picx=contentJSON.getString("previewPicture")>
            <#assign picxUrl=genarateImgUrl(picx)>
            <#assign z=contentJSON.put("previewPicture",picxUrl)>
        </#if>
      <#assign z=replaceStringWithImagesArray(contentJSON,"pictures")>
      <#assign groupedCategories="">
      <#assign groupedCategories=suggestoMkspAPI.getGroupedArticleCategories(groupId,articleId,locLng,locDef)>
      <#if groupedCategories != "">
        <#assign z=contentJSON.put("groupedCategories",groupedCategories)>
      </#if> 
      ${article.getJSONObject("data").toString()}
      <#else>
      {
          "articleId":"${articleId},
          "status":"notfound"
      }
      </#if>
  
  </#macro> 
  <#function getAndorOrParam param andOrOr default >
    <#if param?length<=0>
    <#return default>
    </#if>
    <#assign pr = default>
    <#assign prvalues=param?split(",")>
    <#assign counter = 0 >
    <#list prvalues as x>
      <#if counter == 0 >
        <#assign pr = x>
      <#else>
          <#assign pr = pr + " ${andOrOr} " + x?trim>
      </#if>
      <#assign counter = counter + 1 >
    </#list>
    <#return pr>
  </#function>

  <#function resolveItems contentJSON nodeName>
      <#if contentJSON.getString(nodeName)?has_content && ! contentJSON.getJSONArray(nodeName)?has_content  >
          <#assign node=contentJSON.getString(nodeName)>
          <#assign jnode=JSONFactoryUtil.createJSONObject(node)>
          <#assign stageGroupId=jnode.getString("groupId")>
          <#assign className=jnode.getString("className")>
          <#assign classPK=jnode.getString("classPK")>
          <#assign linkedArticle = journalServiceAPI.getLatestArticle(classPK?number?long)/>
          <#assign stageArticleId=linkedArticle.getArticleId()>
          <#assign stageDocument="">
          <#assign stxArray=jsonFactoryUtil.createJSONArray()>
          <#assign stageDocument=d40Service.getByLng(stageGroupId?number,"",stageArticleId,lng) ! >
          <#if stageDocument?has_content>
              <#-- sostituisco previewMediaItem che può essere multiplo -->
                  <#assign stageDocumentCJson=stageDocument.getJSONObject("data").getJSONObject("contentJSON")>
                  <#assign z=resolveItem(stageDocumentCJson,"beacon")>
                  <#assign z=replaceStringWithJSONObject(stageDocumentCJson,"geoRef")>
                  <#assign preview=stageDocumentCJson.getJSONObject("preview")>
                  <#assign picx=preview.getString("previewPicture")>
                  <#assign picxUrl=genarateImgUrl(picx)>
                  <#assign z=preview.put("previewPicture",picxUrl)>
                  <#assign z=replaceStringWithImagesArray(preview,"previewMediaItems")>
                  <#assign z=replaceObjectWithArray(stageDocumentCJson,"infoItems")>
                  <#assign infoItems=stageDocumentCJson.getJSONArray("infoItems")>
                  <#list 0..infoItems.length()-1 as i>
                    <#assign infoItem = infoItems.getJSONObject(i)>
                      <#assign picx=infoItem.getString("infoItemPicture")>
                      <#assign picxUrl=genarateImgUrl(picx)>
                      <#assign z=infoItem.put("infoItemPicture",picxUrl)>

                    <#assign z=replaceStringWithImagesArray(infoItem,"infoItemMediaItem")>
                  </#list>
                  <#--
                  <#list 0..infoItems.length()-1 as i>
                    <#assign infoItem = infoItems.getJSONObject(i)>
                      <#assign preview=infoItem.getJSONObject("preview")>
                      <#assign picx=preview.getString("infoItemPicture")>
                      <#assign picxUrl=genarateImgUrl(picx)>
                      <#assign z=infoItem.put("infoItemPicture",picxUrl)>
                    <#assign z=replaceStringWithImagesArray(infoItem,"infoItemMediaItem")>
                  </#list>

                  -->
            <#assign z=stxArray.put(stageDocument.getJSONObject("data"))>
          <#else>
            <#assign z=stxArray.put("notFound")>
          </#if>
           <#assign z=contentJSON.put(nodeName+"Obj",stxArray)> 
  <#--
        <#assign z=contentJSON.put(nodeName+"Obj",stageGroupId)> 
          <#return    contentJSON>     
  -->        
      <#else>
          <#if contentJSON.getJSONArray(nodeName)?has_content>
              <#assign stages=contentJSON.getJSONArray(nodeName)>
              <#assign stxArray=jsonFactoryUtil.createJSONArray()>
                <#list 0..stages.length()-1 as i>
                  <#assign node = stages.getString(i)>
                  <#if node?has_content>
                      <#assign jnode=JSONFactoryUtil.createJSONObject(node)>
                      <#if jnode.getString("groupId")?has_content>
                        <#assign stageGroupId=jnode.getString("groupId")>
                      <#else>
                        <#assign stageGroupId=groupId>
                      </#if>
                      <#assign className=jnode.getString("className")>
                      <#assign classPK=jnode.getString("classPK")>
                      <#assign linkedArticle = journalServiceAPI.getLatestArticle(classPK?number?long)/>
                      <#assign stageArticleId=linkedArticle.getArticleId()>
                      <#assign stageDocument="">
                      <#assign stageDocument=d40Service.getByLng(stageGroupId?number,"",stageArticleId,lng) ! >
                            <#assign stageDocumentCJson=stageDocument.getJSONObject("data").getJSONObject("contentJSON")>
                              <#assign z=replaceStringWithJSONObject(stageDocumentCJson,"geoRef")>
                              <#assign z=resolveItem(stageDocumentCJson,"beacon")>
                              <#assign preview=stageDocumentCJson.getJSONObject("preview")>
                              <#assign picx=preview.getString("previewPicture")>
                              <#assign picxUrl=genarateImgUrl(picx)>
                              <#assign z=preview.put("previewPicture",picxUrl)>
                              <#assign z=replaceStringWithImagesArray(preview,"previewMediaItems")>
                              <#assign z=replaceObjectWithArray(stageDocumentCJson,"infoItems")>
                              <#assign infoItems=stageDocumentCJson.getJSONArray("infoItems")>
                              <#list 0..infoItems.length()-1 as i>
                                  <#assign infoItem = infoItems.getJSONObject(i)>
                                  <#assign picx=infoItem.getString("infoItemPicture")>
                                  <#assign picxUrl=genarateImgUrl(picx)>
                                  <#assign z=infoItem.put("infoItemPicture",picxUrl)>
                                <#assign z=replaceStringWithImagesArray(infoItem,"infoItemMediaItem")>
                              </#list>
                        <#assign z=stxArray.put(stageDocument.getJSONObject("data"))>
                      <#else>
                        <#assign z=stxArray.put("notFound")>
                  </#if>
                </#list>
              <#assign z=contentJSON.put(nodeName+"Obj",stxArray)> 
          </#if>
      </#if>
      <#return contentJSON>
  </#function>

  <#function resolveItem contentJSON nodeName>
    <#assign objItemDocument=JSONFactoryUtil.createJSONObject()>
    <#assign itemDocumentCJson=JSONFactoryUtil.createJSONObject()>
    <#if contentJSON.getString(nodeName)?has_content>
        <#assign node=contentJSON.getString(nodeName)>
        <#assign jnode=JSONFactoryUtil.createJSONObject(node)>
        <#assign itemGroupId=jnode.getString("groupId")>
        <#assign className=jnode.getString("className")>
        <#assign classPK=jnode.getString("classPK")>
        <#assign linkedArticle = journalServiceAPI.getLatestArticle(classPK?number?long)/>
        <#assign itemArticleId=linkedArticle.getArticleId()>
        <#assign itemDocument="">
        <#assign itemDocument=d40Service.getByLng(itemGroupId?number,"",itemArticleId,lng) ! >
        <#if itemDocument?has_content>
                <#if itemDocument.getJSONObject("data")?has_content>
                  <#assign objItemDocument=itemDocument.getJSONObject("data")>
                  <#assign itemDocumentCJson=itemDocument.getJSONObject("data").getJSONObject("contentJSON")>
                  <#assign z=replaceStringWithJSONObject(itemDocumentCJson,"geoRef")>
                </#if>
        </#if>
    </#if>
    <#assign z=contentJSON.put(nodeName+"Obj",itemDocumentCJson)> 
    <#return contentJSON>
  </#function>

<#function  replaceStringWithArray element fieldName>
          <#assign arrayItem=element.getJSONArray(fieldName)!>
          <#if ! arrayItem?has_content>
            <#assign arrayItem=jsonFactoryUtil.createJSONArray()>
            <#assign pic=element.getString(fieldName)>
            <#if pic?has_content>
              <#assign z=arrayItem.put(pic)>
            </#if>
            <#assign z=element.put(fieldName,arrayItem)>
          </#if>
          <#return element>
  </#function>

<#function  replaceStringWithJSONObject element fieldName>
          <#assign item=element.getString(fieldName)!>
          <#if item?has_content>
            <#assign objItem=jsonFactoryUtil.createJSONObject(item)>
            <#assign z=element.put(fieldName,objItem)>
          </#if>
          <#return element>
  </#function>


<#function  replaceStringWithImagesArray element fieldName>
          <#assign arrayItem=element.getJSONArray(fieldName)!>
          <#if ! arrayItem?has_content>
            <#assign arrayItem=jsonFactoryUtil.createJSONArray()>
            <#assign pic=element.getString(fieldName)>
            <#assign imgUrl=genarateImgUrl(pic)>
            <#if imgUrl?has_content>
            <#assign z=arrayItem.put(imgUrl)>
            </#if>
            <#assign z=element.put(fieldName,arrayItem)>
          <#else>
              <#assign newArrayItem=jsonFactoryUtil.createJSONArray()>
              <#list 0..arrayItem.length()-1 as ci>
                  <#assign infoItem=arrayItem.getString(ci)>
                  <#assign imgUrl=genarateImgUrl(infoItem)>
                  <#assign z=newArrayItem.put(imgUrl)>
              </#list>
              <#assign z=element.put(fieldName,newArrayItem)>
          </#if>

          <#return element>
  </#function>
<#function genarateImgUrl str>
        <#assign imgObj=JSONFactoryUtil.createJSONObject(str)>
        <#assign imgUrl="/documents/"+imgObj.getString("groupId")+"/0/"+imgObj.getString("title")+"/"+imgObj.getString("uuid")>
        <#return imgUrl>

</#function>
<#function  replaceObjectWithArray element fieldName>
          <#assign arrayItem="">
          <#assign arrayItem=element.getJSONArray(fieldName)!>
          <#if ! arrayItem?has_content>
            <#assign arrayItem=jsonFactoryUtil.createJSONArray()>
            <#assign ob=element.getJSONObject(fieldName)>
            <#if ob?has_content>
              <#assign z=arrayItem.put(ob)>
            </#if>
            <#assign z=element.put(fieldName,arrayItem)>
          </#if>
          <#return element>

  </#function>


  <#function getLngStringFromJsonObject jsonObj fieldName lng defLng default >
    <#assign found=false>
    <#assign retSz=getLngStringFromJsonObjectInternal(jsonObj, fieldName, lng, defLng)>
    <#if retSz=="notFound">
      <#assign newLng=lng?split("_")[0]>
      <#assign newDefLng=defLng?split("_")[0]>
      <#assign retSz=getLngStringFromJsonObjectInternal(jsonObj, fieldName, newLng, newDefLng)>
      <#if retSz=="notFound">
        <#assign retSz=default>
      <#else>
        <#assign found=true>
      </#if>
    <#else>
      <#assign found=true>
    </#if>
    <#if found==false>
      <#assign retSz=default>
    </#if>
    <#return retSz?js_string?replace("\\'", "'")?replace("\\>",">")>
  </#function>
  <#function getLngStringFromJsonObjectInternal jsonObj fieldName lng defLng  >
    <#assign found=false>
    <#if jsonObj.getJSONArray(fieldName + "_" +lng) ??>
      <#assign retObj = jsonObj.getJSONArray(fieldName + "_" +lng)>
      <#assign found=true>
    </#if>
    <#if found==false>
      <#if jsonObj.getJSONArray(fieldName + "_" +defLng) ??>
        <#assign retObj = jsonObj.getJSONArray(fieldName + "_" +defLng)>
        <#assign found=true>
      </#if>
    </#if>
    <#if found==false>
      <#if jsonObj.getJSONArray(fieldName) ??>
        <#assign retObj = jsonObj.getJSONArray(fieldName)>
        <#assign found=true>
      </#if>
    </#if>
    <#if found==true>
        <#assign retSz = retObj.getString(0)>
    </#if>
    <#if found==false>
      <#if jsonObj.getString(fieldName+ "_" +lng) !="">
        <#assign retSz = jsonObj.getString(fieldName + "_" +lng)>
        <#assign found=true>
      </#if>
    </#if>
    <#if found==false>
      <#if jsonObj.getString(fieldName+ "_" +defLng) !="">
        <#assign retSz = jsonObj.getString(fieldName + "_" +defLng)>
        <#assign found=true>
      </#if>
    </#if>
    <#if found==false>
      <#if jsonObj.getString(fieldName) !="">
        <#assign retSz = jsonObj.getString(fieldName)>
        <#assign found=true>
      </#if>
    </#if>
    <#if found==false>
      <#return "notFound">
    </#if>
    <#return retSz>
  </#function>

  </#compress>