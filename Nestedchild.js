



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
    if (!(this instanceof Nestedchild)) return new Nestedchild(selector)
    this.root  = this.getPopulator(this.setSelector(selector), null);
}
/**
 * Establece el selector actual
 * @name Nestedchild#setSelector
 * @method
 * @param {*} selector
 * @returns this
 */
Nestedchild.prototype.setSelector = function(selector){
    if(typeof selector == "object" ) return selector;
    if(typeof selector == "string" ){
      if(selector.startWith('.')) return  document.querySelectorAll(selector);
      if(selector.startWith('#')) return  document.getElementById(selector);
    }
    alert('Unknow selector "'+ selector +'" en Nestedchild:setSelector(selector)');
   return null;
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
       parent: parent|null,
       source: object.getAttribute('data-source'),
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
    var _data = {};
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
