/**
 * Immediately-Invoked Function Expression (IIFE).
 * @function
 * @param {object} window - Global window object.
 * @returns {Object} window.{Fielddefinition, Fieldvaluecode}
 */
(function(window, JsonApiSpec, undefined) {
    'use strict';
    
    const CODING={
      I: 'International coding',
      U: 'Uncoded',
      L = 'Locally coded' 
    }
    const VALUETYPE={
      S: 'Single-valued',
      M: 'Multi-valued'
    };
    const DATATYPE={
                'A' : 'Alphanumeric up to 255 chars long (A1-A255)',
                'N' : 'Numeric; A "real" number allowing decimal places and many significant digits, typically around 15.',
                'D' : 'Date. Accepts only full valid dates',
                'L' : 'Logical. True or False',
                'I' : 'Integer (short); A whole number in the range -32,767 to +32,768.',
                'S' : 'Short integer up to 32768',
                'M' : 'Memo ;variable length free text',
                'B' : 'BLOB; A Binary Large Object e.g. a photo image'
    }
    const ENTITY={
                AR:  'Article in a publication',
                AT:  'Field or attribute',
                AV:  'Field value',
                CA:  'Cave or karst feature',
                EN:  'Entity',
                OR:  'Organisation',
                PA:  'Land parcel',
                PB:  'Publication',
                PE:  'Person',
                PH:  'Photograph',
                PL:  'Plan or map',
                PM:  'Marker (Permanent mark)',
                PS:  'Map series',
                RE:  'Region or area',
                RL:  'Role',
                RP:  'Report',
                SM:  'Specimen',
                SP:  'Species',
                ST:  'Site',
                SU:  'Subject',
                SV:  'Survey',
                SY:  'System field',
                XK:  'A key-in batch',
                XL:  'An upload batch',
                XU:  'An update batch'
    }

        //##### Fieldvaluecode    ####
    /**
     * Fieldvaluecode class.
     * @name Fieldvaluecode
     * @constructor
     * @augments JsonApiSpec
     * @throws ExceptionInvalidType
     */
    function Fieldvaluecode(data) {
        JsonApiSpec.call(this, data);
        isExpectedEntityType(this.type, 'fieldvaluecode')
        this.lang='en',
        this.dictionary={
            coding: CODING,
            datatype: DATATYPE,
            valuetype: VALUETYPE,
            entity: ENTITY
        }
        this.trans= {}   
        this.getCoding= function(){
            let type= this.get('coding')
            return type && CODING.hasOwnProperty(type)? CODING[type] : type;            
        }
        
        this.addTrans= function(lang, ob){
            for(let konst in ob){
                if(this.dictionary.hasOwnProperty(konst)){
                    for(let el in ob[konst]){
                        if(this.dictionary[konst].hasOwnProperty(el)){
                            this.trans[lang][konst][el] ? ob[konst][el]
                        }
                    }
                }
            }            
        }
        
        
       
    }
    
    Fieldvaluecode.prototype = Object.create(JsonApiSpec.prototype);
    
    
        //##### Fielddefinition    ####
    /**
     * Fielddefinition class.
     * @name Fielddefinition
     * @constructor
     * @augments JsonApiSpec
     * @throws ExceptionInvalidType
     */
    function Fielddefinition(data) {
        JsonApiSpec.call(this, data);
        isExpectedEntityType(this.type, 'fielddefinition')
        
        this.getValueType= function(){
            let type= this.get('valuetype')
            return type && VALUETYPE.hasOwnProperty(type)? VALUETYPE[type] : type;
        }
        this.getDataType= function(){
            let type= this.get('datatype')
            return type && DATATYPE.hasOwnProperty(type)? DATATYPE[type] : type;
        }
        this.getEntity= function(){
            let type= this.get('entity')
            return type && ENTITY.hasOwnProperty(type)? ENTITY[type] : type;
        }        
    }
    Fielddefinition.prototype = Object.create(Fieldvaluecode.prototype);

    window.Fieldvaluecode= Fieldvaluecode;
    window.Fielddefinition= Fielddefinition;

}(window, JsonApiSpec));
