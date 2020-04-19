	'use strict';

/**
 *
 * @constructor
 * @name JSimas
 * @param {*} selector
 */
 function JSimas (selector) {
    if (!(this instanceof JSimas)) return new JSimas(selector)
    this._element
    this.setSelector(selector);
}

/**
 * Establece el selector actual
 * @name JSimas#setSelector
 * @method
 * @param {*} selector
 * @returns $this
 */
JSimas.prototype.setSelector = function(selector){
    this._element = document.querySelectorAll(selector)
    return this;
};
