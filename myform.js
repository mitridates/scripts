(function( $ ){

var methods =
	init : function(options) {
		//??
	},
	/**
	 * Retorna el objeto/objetos input de un selector como array
	 * @returns {Array}
	 */
	toArray : function( ) {  
	    let notin = [':button', ':submit', ':reset', ':hidden'], arr = [];
	    $(':input', this).not(notin.join(', ')).each( function(){ arr.push(this); });
	    return arr;
	},
	/**
	* Enable/disable childNodes
	* @param {bool|null} dsbl
	* @returns self
	*/
	disable: function(dsbl){
		[].map.call(methods.toArray.apply(this), function(obj) {
				obj.disabled = typeof dsbl === "boolean" ? dsbl :  !obj.disabled;
		});
		return this;
	},
	/**
	 * Clear form/childs node values
	 * @example :
	 *           ('#form, #formid2, ...').myform('clear')
	 *           Grot('#tableid').form('clear')
	 * @returns self
	 */
	clear: function(){
		[].map.call(methods.toArray.apply(this), function(obj) {
		obj.classList.contains('select2')?  $(obj).val(null).trigger('change') : obj.value = '';
		$(obj).removeAttr('checked').removeAttr('selected');
		});
		return this;
    },
       
    };

    $.fn.myform = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }    
    };
})( jQuery );
