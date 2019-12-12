



/**
 * @fileOverview Constructor Nestedchild / Populate
 * @author <a href="mailto:mitridates@gmail.com">Mitridates</a>
 * @version 1.0
 */

/**
 *
 * @class Clase para crear nested select
 * @constructor
 * @name Nestedchild
 * @param {*} selector
 */
 function Nestedchild (selector) {
    this.root  = this.getSelector(selector);
    if(this.root==null || this.root.tagName.toLowerCase()!=='select'){
     console.log('Tipo de selector equivocado '+(typeof this.root)+', se esperaba "SELECT"');
     return;
    }
}
/**
 * Establece el selector actual
 * @name Nestedchild#setSelector
 * @method
 * @param {*} selector
 * @returns this
 */
Nestedchild.prototype.getSelector = function(selector){
    return (typeof selector === "object" )? selector : document.querySelector(selector);
};

/**
 * Get nest
 * @name Nestedchild#getPopulator
 * @method
 * @param {Object} object Children/root
 * @param {Object|null} parent
 * @returns this
 */
Nestedchild.prototype.getPopulator = function(object, parent){
     return {
       parent: parent,
       source: object.getAttribute('data-source'),
       parameters: object.getAttribute('data-parameters'),
       child: object.getAttribute('data-child'),
      };
};

/**
 * Immediately-Invoked Function Expression (IIFE).
 * @function
 * @param {Object} Grot - Global window object.
 * @returns {Object} window.Grot.cache
 */
(function() {
    /**
     * No exponemos variables
     * @var {Object} _data
     */   
    let Population = {};
    /**
     * Cache global para la página actual. IIEF para no exponer variables de forma global.
     * @name Grot.cache
     * @function
     */
    Grot.cache = {
        /**
         * Get cache key
         * @name Grot.cache#get
         * @param {string} key
         */
        get: function(key) {
        return _data.hasOwnProperty(key)? _data[key] : null ;
        },
        /**
         * @param {string} key
         * @param {*} value
         */
        add: function(key, value) {
            var data =  _data.hasOwnProperty(key)? _data[key] : [] ;
            if(data instanceof Array){
                data.push(value);
                return this.set(key, data);
            }else{
                console.log('Tipo de dato equivocado '+(typeof data)+', se esperaba "Array"');
            }
        },
        /**
         * @param {string} key
         * @param {*} value
         */
        set: function(key, value) {
         _data[key] = value;
         return this;//chaining
        },
        /**
         * @param {string} key
         */
        unset: function(key){
            if(_data.indexOf(key)!==-1) delete _data[key];
            else   console.log('Index "'+ key +'" no definido en cache');
            return this;
        }  
    };
})(window.Grot = window.Grot || {});
