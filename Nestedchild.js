/**
 * @fileOverview Constructor Repoblar
 * @author <a href="mailto:mitridates@gmail.com">Mitridates</a>
 * @version 1.0
 */

/**
 *
 * @class Clase para poblar nested select
 * @constructor
 * @name Repoblar
 * @param {*} selector
 */
 function Repoblar(selector) {
    this.root  =  (typeof selector === "object" )? selector : document.querySelector(selector);
    if(this.root==null || this.root.tagName.toLowerCase()!=='select'){
      console.log('Tipo de selector equivocado "'+  selector +'", se esperaba "SELECT"');
    }
  }

/**
 * 
 * @name Repoblar#isSelector
 * @method
 * @param {Object} el element type SELECT
 * @returns boolean
 */
Repoblar.prototype.isSelector = function(el){
     let e (typeof selector === "object" )? selector : document.querySelector(selector);
};

/**
 * 
 * @name Repoblar#getSelector
 * @method
 * @param {Object} el element type SELECT 
 * @param {Object|null} parent Parent node, null if root
 * @returns this
 */
Repoblar.prototype.getSelector = function(el, parent){
     return {
       self: el,
       parent: parent,
       source: document.getElementobject.getAttribute('data-source'),
       parameters: el.getAttribute('data-parameters'),
       child:el.getAttribute('data-child')
      };
};
