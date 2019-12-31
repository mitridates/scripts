(function( $ ){

    var methods = {
        init : function(options) {

        },
        /**
         * Retorna el objeto/objetos input de un selector como array
         * @returns {Array}
         */
        toArray : function( ) {  
         let types = ['input', 'select', 'checkbox', 'select'],
             notin = [':button', ':submit', ':reset', ':hidden'],
             arr = [];
             if($(this).is(types.join(', '))){//es 1-n objetos : [selector, ...]
                $(this).each(function () {
                    arr.push(this);
                });
            }else{ //todos los chids input dentro de un elemento del dom
                $(':input', this)
                    .not(notin.join(', '))
                    .each(function () {
                        arr.push(this);
                    });
            }
            return arr;
        },
    /**
     * Enable/disable childNodes
     * @param {bool|null} dsbl
     * @returns {Object} this
     */
    disable: function(dsbl){
        let obs = methods.toArray.apply(this), length =  obs.length;
        for(var i = 0; i< obs.length; i++){
            obs[i].disabled = typeof dsbl === "boolean" ? dsbl :  !obs[i].disabled;
        }

/*        $(':input', this._selector) //this._selector {Object} Form input? selector
            .not(':button, :submit, :reset, :hidden').each(
            function () {
                this.disabled = typeof dsbl === "boolean" ? dsbl :  !this.disabled;
            }
        );*/

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
