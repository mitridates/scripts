(function( $ ){

var methods = {
	/**
	 * jquery :input Selects all input, textarea, select and button elements
	 * @returns {Array}
	 */
	toArray : function( ) {  
	    let notin = [':button', ':submit', ':reset', ':hidden'], arr = [];
	    $(':input', this).not(notin.join(', ')).each( function(){ arr.push(this); });
	    return arr;
	},
	/**
	 * Toggle/set disable true/false
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
	 * Clear input, checkbox, select...
	 * @returns self
	 */
	clear: function(){
		[].map.call(methods.toArray.apply(this), function(obj) {
		obj.classList.contains('select2')?  $(obj).val(null).trigger('change') : obj.value = '';
		$(obj).removeAttr('checked').removeAttr('selected');
		});
		return this;
    	},
	submit(url, jsonParams, callback){
		let $this= this;
		if(this[0].tagName=='FORM'){
			let fd= new FormData(this[0]);
		}else{
			//mal
		 	let fd= new FormData();
			[].map.call(methods.toArray.apply(this), function(obj) {
				fd .append(obj.name, obj.value);
			});
		}
		fd = (this[0].tagName=='FORM') new FormData(this[0]) : new FormData();
		for ( var key in jsonParams||{} ) {
			fd .append(key, jsonParams[key]);
		}
		//Grot.spinner.show();
		$.ajax({
			url: url,
			type: "POST",
			cache: false,
			data: fd,
			processData: false,  // tell jQuery not to process the data
			contentType: false,   // tell jQuery not to set contentType+
			success: function(data){
				//Grot.spinner.hide();
				if(typeof callback===  'function'){
					callback.call($this, data);
				}				
			}
			return this;
		});
		
	}
    };

    $.fn.myform = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.myform' );
        }    
    };
})( jQuery );
