/**
 * Immediately-Invoked Function Expression (IIFE).
 * @function
 * @param {object} window - Global window object.
 * @returns {Object} window.{Fielddefinityion, Fieldvaluecode}
 */
(function(window, JXhrpost ,JsonApiManager, JsonApiSpec, undefined) {
    'use strict';
    const CODING={
      I: 'International coding',
      U: 'Uncoded',
      L = 'Locally coded' 
    }
     
     S = Single-valued   M = Multi-valued
    /**
     * Value & codes
     * @constructor
     * @name Fieldvaluecode
     * @param {Object} - JSON:API resource object
     * @see https://kid.caves.org.au/kid/doc/codes
     */
    function Fieldvaluecode(data){
        this.id = data.id;
        this.coding= data.coding;
        this.codes = {};
        this.links = data.links||null;
        this.relationships= data.relationships||null;
        this.toString= function (){
            return this.id;
        }
    }

    /**
     * @memberof JsonApiSpec
     * @return {string|null} url
     */
    JsonApiSpec.prototype.toLink= function (){
        return (this.links && this.links.hasOwnProperty('self')) ? this.links.self : null;
    }
    
    /**
     * @memberof JsonApiSpec
     * @return {string|null} href
     */    
    JsonApiSpec.prototype.toAnchor= function (){
        let a= this.toLink(),
            name= this.toString === Object.prototype.toString ? this.id : this.toString();//No hay link o el método toString no ha sido sobreescrito
        return a? ['<a href="',a,'">', name,'</a>'].join('') : null;
    }
    
    /**
     * Get attribute|[attributes]|property by name or function. Function can returns compound values
     * @memberof JsonApiSpec
     * @param {string|*} s
     * @return {string|*}
     */    
    JsonApiSpec.prototype.get= function (s){
        let i, ret=[];
        switch (typeof s){
            case "string":
                if(s==='id'){
                    return this.id
                }else if(s==='type'){
                    return this.type
                }else{
                    return this.attributes[s];
                }
            case "function": return  s.call(this, this.attributes);
        }

        if(Array.isArray(s)){
            for(i=0; i<s.length; i++){
                ret[i]=this.get(s[i])
            }
            return ret
        }
        return null;
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
        this.entities= []
    }

    /**
     * Set instance of JsonApiSpec
     * @memberof JsonApiManager
     * @param {Object} ob - Single JSON:API resource object
     * @return {JsonApiSpec}
     */
    JsonApiManager.prototype.toJsonApiSpec= function(ob){
        let className= ob.type.charAt(0).toUpperCase() + ob.type.slice(1);
        switch (className){
            case 'Person': return new Person(ob);
            default: return new JsonApiSpec(ob)
        }
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
                return this.toJsonApiSpec(inc)
            }
        }
        //posible null???
        return null
        //return new JsonApiSpec(inc)
    }

    /**
     * Parse XMLHttpRequest Response
     * @memberof JsonApiManager
     * @return {Array}
     */
    JsonApiManager.prototype.parseResponse = function() {
        let i,spec, inc;

        for(i=0; i<this.data.length;i++){//loop response.data
            spec= this.toJsonApiSpec(this.data[i])

            for (let key in spec.attributes){
                if(spec.relationships && spec.relationships[key]){
                    //podría devolver null this.getIncluded() ?
                    // inc = this.getIncluded(spec.relationships[key].data)
                    // if(inc){
                    //     spec.attributes[key]= inc
                    //
                    // }
                    spec.attributes[key] = this.getIncluded(spec.relationships[key].data)
                }
            }
            this.ret.push(spec)
        }
        return this.ret;
    }

    /**
     * Retorna un arreglo de valores de acuerdo a las claves solicitadas
     * @memberof JsonApiManager
     * @param {Array} fields - Claves del objeto a devolver
     * @param {Array} fn - array de pares {key:function(JsonApiSpec, value)} que permite retornar un valor calculado para dicha clave.
     *                      key debe encontrarse en el array fields
     * @return {Array}
     */
    JsonApiManager.prototype.get = function(fields= [], fnArr=null) {
        let i, ii, el, field, val,
            ret=[],
            arr=[],
            parsed= this.ret.length? this.ret : this.parseResponse();

        if(arguments.length===0) return this.parsed
        
        for(i=0; i<parsed.length; i++){
            el= parsed[i] //JsonApiSpec
            arr=[]

            for(ii=0; ii<fields.length; ii++){

                field= fields[ii]
                val= el.get(field)//puede ser string|object

                if(fnArr && fnArr.hasOwnProperty(field)){//puede ser un valor compuesto
                    arr.push(fnArr[field].call(el, val))
                }else if(val instanceof JsonApiSpec){//utilizamos toString
                    arr.push(val.toString())
                }else{
                    arr.push(val)
                }
            }
            ret.push(arr)
         }
        return ret;
    }

    //##### End jsonApiManager    ####
    
    //##### Person    ####
    /**
     * Person class.
     * @name Person
     * @constructor
     * @augments JsonApiSpec
     * @throws ExceptionInvalidType
     */
    function Person(data) {
        JsonApiSpec.call(this, data);
        isExpectedEntityType(this.type, 'person')
        this.toString= function (){
            return this.attributes.name+' '+this.attributes.surname;
        }

    }
    
    Person.prototype = Object.create(JsonApiSpec.prototype);

    window.JsonApiManager= JsonApiManager;
    window.JsonApiSpec= JsonApiSpec;

}(window, JXhrpost ,JsonApiManager, JsonApiSpec));
