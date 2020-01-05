(function( $ ){

    var methods = {
        init : function(options) {

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
        let obs = methods.toArray.apply(this), lngth =  obs.length;
        for(var i = 0; i< lngth; i++){
            obs[i].disabled = typeof dsbl === "boolean" ? dsbl :  !obs[i].disabled;
        }
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
        let _clear = function (e) {
           e.classList.contains('select2')?  $(e).val(null).trigger('change') : e.value = '';
           $(e).removeAttr('checked').removeAttr('selected');
        }

        if($(this).is('input, select, checkbox')){//es 1-n objetos : [selector, ...]

          $(this._selector).each(function () {
              _clear(this);
          });

        }else{ //todos los chids input dentro de un elemento del dom

            $(':input', this._selector)
                .not(':button, :submit, :reset, :hidden')
                .each(function () {
                _clear(this);
            });
        }
        //        $(this._selector).find('input:radio, input:checkbox, input[type=text], input[type=password], input[type=file], select, textarea').val('');//select selectivo
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
