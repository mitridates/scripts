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
 * @name Repoblar#getChild
 * @method
 * @param {Object} el element type SELECT 
 * @returns {Object|null} 
 */
Repoblar.prototype.getChild = function(el){
 return document.querySelector(el.getAttribute('data-child'));
};

/**
 * @name Repoblar#bindCascade
 * @method
 * @param {Object} el element type SELECT 
 * @param {Object|null} parent Parent node, null if root
 * @returns this
 */
Repoblar.prototype.bindAll = function(){
  let el = this.root;
  let child = document.querySelector(this.getChild(el));
  let $this = this;
 
  do{
     el.addEventListener('change', (event) => {
     if(el.options[el.selectedIndex].value==''){
      child.length=1;
     }else{
      $this.populateChild(child, el.options[el.selectedIndex].value)
     }
     el= child;
     child= document.querySelector($this.getChild(el));
    });
   } while (child !==null );
 return this;
};


/**
 * @name Repoblar#populateChild
 * @method
 * @param {Object} el element type SELECT 
 * @param {string} value get options by this value
 * @returns this
 */
Repoblar.prototype.getData = function(el, value){
    let elementData = this.getData(el);
    let result= {};
    if(elementData.type=='json'){
      result = window[elementData.source][value];
    }else if(elementData.type=='xht'){
     let requestData = new FormData();
         requestData.append(elementData.key, value)
      let xhr = new XMLHttpRequest();
      xhr.open('POST', elementData.source, true);
      xhr.onload = function () {
        return this.responseText;
     };
     xhr.send(requestData);
    }
    
};

/**
 * @name Repoblar#getSelector
 * @method
 * @param {Object} el element type SELECT 
 * @param {Object|null} parent Parent node, null if root
 * @returns this
 */
Repoblar.prototype.getData = function(el){
     return {
       type: document.getElementobject.getAttribute('data-type'),//json/url
       source: document.getElementobject.getAttribute('data-source'),
       key: document.getElementobject.getAttribute('data-key'),
       parameters: el.getAttribute('data-parameters'),
       child:el.getAttribute('data-child')
      };
};

let repoblar = new Repoblar('countrySelector');
