/**
 * Immediately-Invoked Function Expression (IIFE).
 * @function
 * @param {object} window - Global window object.
 * @returns {Object} window.{JsonApiManager, JsonApispec, JsonApiSpecFactory}
 */
(function(window, undefined) {
    'use strict';

    //#####    Singleton     ####
    /**
     *  Factory Add && set JsonApiSpec types
     * @type {{exist: (function(*): boolean), addType: addType, toJsonApiSpec: (function(*): *|JsonApiSpec)}}
     */
    let JsonApiSpecFactory = (function() {
        let types = {};

        function addType(type, callBack){
                 types[type]=callBack
         }
         function toJsonApiSpec (ob){
                 return (types.hasOwnProperty(ob.type))? types[ob.type](ob) : new JsonApiSpec(ob)
            }
        function exist(type){
            return types.hasOwnProperty(type)
        }
        return { // public interface
            addType: addType,
            toJsonApiSpec: toJsonApiSpec,
            exist: exist
        };
    })();

    /**
     * JSON:API Set resource single object
     * @constructor
     * @name JsonApiSpec
     * @param {Object} - JSON:API resource object
     * @see https://jsonapi.org/
     */
    function JsonApiSpec(data){
        this.id = data.id;
        this.type= data.type;
        this.attributes = data.attributes;
        this.meta = data.meta||null;
        this.links = data.links||null;
        this.relationships= data.relationships??null;
        this.toString= function (){
            return this.attributes.hasOwnProperty('name')? this.attributes.name : this.id;
        }

    }

    /**
     * @memberof JsonApiSpec
     * @param {string|null} s
     * @return {string|null} url
     */
    JsonApiSpec.prototype.getLink= function (s){

        return (this.links && this.links.hasOwnProperty(s||'self')) ? this.links[s||'self'] : null;
    }

    /**
     * @memberof JsonApiSpec
     * @return {string|null} href
     */    
    JsonApiSpec.prototype.toAnchor= function (){
        let a= this.getLink('self'),
            name= this.toString === Object.prototype.toString ? this.id : this.toString();//No hay link o el método toString no ha sido sobreescrito
        return a? ['<a href="',a,'">', name,'</a>'].join('') : null;
    }
    
    /**
     * Get attribute|[attributes]|property by name or function. Function can returns compound values
     * @memberof JsonApiSpec
     * @this {JsonApiSpec} Current instance
     * @param {string|*} s
     * @return {string|*} false if not exists
     */    
    JsonApiSpec.prototype.get= function (s){
        let i, ret=[];
        switch (typeof s){
            case "string":
                if(s==='id'){
                    return this.id
                }else if(s==='_type_') {
                    return this.type
                }else{
                    return this.attributes.hasOwnProperty(s)?  this.attributes[s]: null;
                }
            case "function": return  s.call(this, this.attributes);
        }

        if(Array.isArray(s)){
            for(i=0; i<s.length; i++){
                ret[i]=this.get(s[i])
            }
            return ret
        }
        return false;
    }

    /**
     * Set attribute
     * @memberof JsonApiSpec
     * @param {string} key
     * @param {string|*} val     
     * @return {JsonApiSpec}
     */       
    JsonApiSpec.prototype.set= function (key, val){
        this.attributes[key]= val;
        return this;
    }
    /**
     * Set meta
     * @memberof JsonApiSpec
     * @param {string} key
     * @param {string|*} val
     * @return {JsonApiSpec}
     */
    JsonApiSpec.prototype.setMeta= function (key, val){
        this.meta[key]= val
        return this;
    }
    //##### End JsonApiSpec     ####
    //#####    jsonApiManager    ####
   /**
     * Intermediary between XMLHttpRequest response and JsonApiSpec
     * @constructor
     * @name JsonApiManager
     * @param {Array} data - response.data
     * @param {Array|null} included - response.included
     */
    function JsonApiManager(data, included) {
        this.data = data;
        this.included = included||null;
        this.ret= [];
       this.length= 0;
        this.is_parsed= false;
        /**
         * @type string Document/Collection
         */
        this.resource=null;//
    }

    /**
     * Create instance of JsonApiSpec if included
     * @memberof JsonApiManager
     * @param {Object} rel - Relationship{id, type}
     * @return {JsonApiSpec}
     */
    JsonApiManager.prototype.getIncluded= function(rel){
        let inc;
        for (let key in this.included){
            inc= this.included[key]
            if (inc.type===rel.type && inc.id===rel.id) {
                return JsonApiSpecFactory.toJsonApiSpec(inc)
            }
        }
        //posible null???
        return null
        //return new JsonApiSpec(inc)
    }


    /**
     * Parse JsonApiSpec and get relationships
     * @param {JsonApiSpec} spec
     * @memberof JsonApiManager
     * @return JsonApiSpec
     */
    JsonApiManager.prototype.parseSpec = function(spec) {
        let i, ii;
        for (let key in spec.attributes){
            if(spec.relationships && spec.relationships[key]){
                spec.attributes[key] = this.getIncluded(spec.relationships[key].data)
            }
            if(spec.attributes[key] && typeof spec.attributes[key]==="object"
                && spec.attributes[key].hasOwnProperty('data')
            ){
                spec.attributes[key]= (new JsonApiManager(spec.attributes[key].data, spec.attributes[key].included??null)).getParsed()
            }
            if(spec.hasOwnProperty('meta')){
                for(let key in spec.meta){
                    if(Array.isArray(spec.meta[key]) && typeof spec.meta[key][0] ==='object' && spec.meta[key][0].hasOwnProperty('type')){
                            spec.meta[key]= (new JsonApiManager(spec.meta[key])).getParsed()
                    }
                }
            }

        }
        return spec
    }

    /**
     * Parse XMLHttpRequest Response
     * @memberof JsonApiManager
     * @return JsonApiManager
     */
    JsonApiManager.prototype.parseResponse = function() {
        let i;
        if(this.is_parsed) return this

        this.resource= typeof this.data ==='object' && this.data.hasOwnProperty('type')? 'document' : 'collection'

        if(this.resource==='document'){
            this.ret.push(this.parseSpec(JsonApiSpecFactory.toJsonApiSpec(this.data)))
        }else{
            for(i=0; i<this.data.length;i++){//loop response.data
                this.ret.push(this.parseSpec(JsonApiSpecFactory.toJsonApiSpec(this.data[i])))
            }
        }
        this.length= this.ret.length
        this.is_parsed=true;
        return this;
    }

    /**
     * Search in response
     * @memberof JsonApiManager
     * @param {Object} s Search {key:val,...}
     * @param {string|null} type
     * @return {Array} [JsonApiSpec]
     */
    JsonApiManager.prototype.findBy = function(s, type=null ) {
        let i, el, val,
            ret=[],
            parsed= this.getParsed();

        for(i=0; i<parsed.length;i++){//loop response.data
            el= parsed[i]

            if(type && el.type!==type) continue

            for(let k in s){
                val= el.get(k)
                if(val===false){
                    continue//not found
                }

                if(typeof s[k] === "string" && s[k]===val){//todo regex
                    ret.push(el)
                }else if(typeof s[k] === "function"){//utilizamos toString
                    if(s[k].call(el, val)!==false){
                        ret.push(el)
                    }
                }
            }

        }
        return ret;
    }

    /**
     * Search by ID
     * @memberof JsonApiManager
     * @param {string} id
     * @return {Array} [JsonApiSpec]
     */
    JsonApiManager.prototype.findById = function(id) {
        let i,
            ret=null,
            parsed= this.getParsed();

        for(i=0; i<parsed.length;i++){//loop response.data
            if(parsed[i].id===id) return parsed[i]
        }
        return ret;
    }

    /**
     * Get parsed response
     * @memberof JsonApiManager
     * @return {JsonApiSpec|JsonApiSpec<Array>} JsonApiSpec document|collection
     */
    JsonApiManager.prototype.getParsed = function() {
        if(!this.is_parsed) this.parseResponse()
        return (this.resource==='document')?  this.ret[0] : this.ret;
    }

    /**
     * - Permite retornar {attributes[key]}|id|_type_
     * - Aplicar funciones como segundo argumento:
     * <pre>
     *   1.- _fn_key fn.call(jas, key) (once)
     *   2.- _data_xxx_key
     *          attributes[Key] raw value (multiple times) return {Object<jsonApiSpec>|*} key
     *          fn.call(jas, key) (multiple times) return *
     * </pre>
     * @example
     *    let parsed = (new JsonApiManager(response.data, response.included)).get([
     *    'country',//=== Country.toString()
     *    '_fn_person',//callback
     *    'person',//=== Person.toString()
     *    '_fn_delete',//callback
     *    '_data_age_person',//fnObj[_data_age_person].call(jsonApiSpec, Person)
     *   '_data_phone_person',//fnObj[_data_phone_person].call(jsonApiSpec, Person)
     *    '_data_foo_person'////not in fnObj, return Person<jsonApiSpec>
     *    ],
     *      {
     *      _fn_delete: function (jas){return '<a href="+jas.links.DELETE+"...>'} //fn.call(jas, jas),
     *       _fn_person: (Person)=>Person!==null;//fn.call(jas, Person){return *},
     *      _data_age_person: (Person)=>Person.get('age');//fn.call(jas, Person),
     *      _data_phone_person: (Person)=>Person.get('phone');//fn.call(jas, Person)
     *      })
     *
     *  parsed= ['Spain', true, 'Pepe Pérez', '<a...></a>', '30', '55555555', Person<jsonApiSpec>]
     *
     * @memberof JsonApiManager
     * @param {Array} fields {attributes[key]}|id|_type_|fnKeyName(_fn_key|_data_xxx_key)
     * @param {Object} fnObj {key:fn} para modificar el valor de clave (debe encontrarse en el array "fields").
     * @return {JsonApiSpec|JsonApiSpec<Array>} JsonApiSpec document|collection
     */
    JsonApiManager.prototype.get = function(fields= [], fnObj=null)
    {
        let i, ii, el, field, rField,val,
            /**
             * @type {RegExp}
             */
            rFunc=/^_fn_/,//_fn_+cadena ... ejecuta fnObj[_fn_+cadena].call(jsonApiSpec, jsonApiSpec)
            /**
             * Search attributes[Key]
             * @type {RegExp}
             */
            rData=/^_data_[\w]_/,
            ret=[],
            arr=[],
            parsed= this.getParsed();

        /**
         * Loop JsonApiSpec[]
         */
        for(i=0; i<parsed.length; i++)
        {

            el= parsed[i] //JsonApiSpec
            arr=[]
            rField= null
            /**
             * Loop fields[]
             */
            for(ii=0; ii<fields.length; ii++)
            {
                field= fields[ii]
                /**
                 * get key |key substring
                 */
                if(rFunc.test(field)){
                    val= el
                }else if(rData.test(field)){
                    rField= field.split('_')
                    val= el.get(rField.pop())
                }else{
                    val= el.get(field)
                }
                /**
                 * callback if exists key in second arg
                 */
                if(fnObj && fnObj.hasOwnProperty(field))
                {
                    arr.push(fnObj[field].call(el, val))//return fn.call(el, value)
                }
                /**
                 * If jas return jas|toString
                 */
                else if(val instanceof JsonApiSpec)//No hay función de retorno
                {
                    if(rField){//queremos el objeto
                        arr.push(val)
                    }else{//queremos toString
                        arr.push(val.toString())
                    }
                    /**
                     * return primitive types
                     */
                }else{
                    arr.push(val)
                }
            }
            ret.push(arr)
        }

        return (this.resource==='document')? ret[0] : ret;
    }
    //##### End jsonApiManager    ####
    
    //##### Person    ####
    /**
     * Person class.
     * @name Person
     * @constructor
     * @augments JsonApiSpec
     */
    function Person(data) {
        JsonApiSpec.call(this, data);

        this.toString= function (){
            return this.attributes['name']+' '+this.attributes['surname'];
        }

    }
    Person.prototype = Object.create(JsonApiSpec.prototype);
    JsonApiSpecFactory.addType('person', (ob)=> new Person(ob))
    //##### Person    ####
    /**
     * Map surveyor class.
     * @name Person
     * @constructor
     * @augments JsonApiSpec
     */
    function Mapsurveyor(data) {
        JsonApiSpec.call(this, data);
        this.toString= function (){
            if(this.attributes.surveyorid instanceof Person){//person
               return this.attributes.surveyorid.toString()
            }else{
                return this.attributes.surveyor
            }
        }

    }
    Mapsurveyor.prototype = Object.create(JsonApiSpec.prototype);
    JsonApiSpecFactory.addType('mapsurveyor', (ob)=> new Mapsurveyor(ob))

    // /**
    //  * Default entity class.
    //  * @name Entity
    //  * @constructor
    //  * @augments JsonApiSpec
    //  */
    // function Entity(data) {
    //     JsonApiSpec.call(this, data);
    //     if(this.attributes.hasOwnProperty('name')){
    //         this.toString= function (){
    //             return this.attributes.name;
    //         }
    //     }
    // }
    // Entity.prototype = Object.create(JsonApiSpec.prototype);
    //JsonApiSpecFactory.addType('EntityName', (ob)=> new Entity(ob))

    window.JsonApiManager= JsonApiManager;
    window.JsonApiSpec= JsonApiSpec;
    window.JsonApiSpecFactory= JsonApiSpecFactory;

}(window));
