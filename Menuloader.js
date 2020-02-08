    /**
     * Lo he utilizado con list-group de bootstrap, aunque podría ser con cualquier otro tipo de menú.
     * Relaciona el hash de los items del menú con ID de los divs ocultos MenuItem.hash == hiddenDiv.id
     * @class
     * @constructor
     * @name Menuloader
     * @param {Object} menu Container for menu items
     * @param {Object} targetsContainer Container for div targets
     */
    function Menuloader (menu, targetsContainer) {
        this.menu  = menu;
        this.targetsContainer = targetsContainer;
        this.postloadAction = [];
        this.preloadAction = [];
        this.itemPostloadAction = {};
        this.lastActiveMenuItem= false;
    }

    /**
     * Add callback before loading div
     * @param {Function} func(dataTarget, menu, menuItem, reload)
     * @return self
     */
    Menuloader.prototype.addPreLoadAction= function(func, async)
    {
        this.preloadAction.push({async: async, callback: func});
        return this;
    };

    /**
     * Run after loading div
     * @param {Function} func(dataTarget, menu, menuItem, reload)
     * @return self
     */
    Menuloader.prototype.addPostLoadAction= function(func)
    {
        this.postloadAction.push(func);
        return this;
    };

    /**
     * Run after loading div
     * @param {string} menuItem menu id
     * @param {Function} func(dataTarget, menu, menuItem, reload)
     * @return self
     */
    Menuloader.prototype.addItemPostLoadAction= function(menuItem, func)
    {
        if(!this.itemPostloadAction.hasOwnProperty(menuItem)){
            this.itemPostloadAction[menuItem]= [];
        }
        this.itemPostloadAction[menuItem].push(func);
        return this;
    };

    /**
     * Run postLoad after loading div.
     */
    Menuloader.prototype.triggerPostloadActions= function(menuItem, dataTarget, reload)
    {      
        let i;
        for(i=0; i<this.postloadAction.length; i++){
            this.postloadAction[i](dataTarget, this.menu, menuItem, reload);
        }
        if(this.itemPostloadAction.hasOwnProperty(menuItem.hash)){
            for(i=0; i<this.itemPostloadAction[menuItem.hash].length; i++){
                this.itemPostloadActionn[menuItem.hash][i](dataTarget, this.menu, menuItem, reload);
            }
        }
        return this;
    };

    /**
     * Show data
     * @param {Object} dataTarget data div container
     */
    Menuloader.prototype.showData= function(dataTarget)
    {
        for (let i = 0; i < this.targetsContainer.children.length; i++) {
            let e = this.targetsContainer.children[i];
            e.style.display = 'none';
        }
        dataTarget.style.display= 'inline';
    };

    /**
     * Load/reload div
     * @param {Object} menuItem Menú link
     * @param {boolean} [async] Is asynchronous loaded
     * @param {boolean} [reload] reload content
     */
    Menuloader.prototype.load= function(menuItem, async, reload)
    {
        let dataTarget  = document.querySelector(menuItem.hash),        
        $this = this;
        
        if(typeof dataTarget === 'undefined'){
            console.log('Target hash ID desconocido: '+ menuItem.hash);
            return false;
        }
        
        // Update history
        //window.history.pushState(null, null, menuItem.href);
        
        document.location.hash = menuItem.hash;
        
//        if(!dataTarget.dataset.path && menuItem.dataset.loaded !== "true"){
//            updateContent();
//        }else if(reload || menuItem.dataset.loaded !== "true"){
//            dataTarget.innerHTML= '<div class="text-center">{{'loading'|trans({},'cavemessages')|raw}}</div>';
//            Grot(dataTarget).loader({}, {'success': updateContent});
//        }
        
        // Update menuItems
        menuItem.dataset.loaded = "true";
        this.menu.querySelector('.active').classList.remove('active')
        menuItem.classList.add('active');
        this.lastActiveMenuItem = menuItem
        
        /**
         * Como cojones hago lo de la carga asíncrona...
         */
        // Update menuContent
        if(reload || menuItem.dataset.loaded !== "true"){
            this.triggerPostloadActions(menuItem, dataTarget, reload)
        }
        this.showData(dataTarget);
    };

    /**
     * Orden de carga
     * 1 - carga hash si existe: ejem: app_dev.php/cave/admin/cave/edit/ESGPT00001/map#karst-citation
     * 2 - Toma el primer elemento del menú
     * 3 - else tab activa por defecto: cave-tab
     *
     */
    $(document).ready(function() {
        /**
         * Los items del menú (<div id="menuItems"></div>) se corresponden con (<div id="menuContent"></div>)
         * Cargamos el tab en url si existe y estamos en edición
         * 1 - carga hash si existe: ejem: app_dev.php/cave/admin/cave/edit/ESGPT00001#citation-tab
         * 2 - else tab activa por defecto: cave-tab
         *
         */
        let menuloader = new  Menuloader(document.getElementById('menuItems'), document.getElementById('menuContent'));
        window.menuloader = menuloader;
        menuloader.addPostLoadAction(function (dataTarget, menu, menuItem, reload) {
            Grot.fn.init();
            {%set selectors = ['organisation', 'mapserie', 'person', 'article', 'cave', 'specie']%}{#'map',#}
            {%for selector in selectors %}
            Grot('.{{selector}}*', dataTarget).select2paginado('{{path('cave_backend_autocomplete_'~selector)}}', {placeholder: '{{('select.'~selector)|trans({},'cavemessages')|raw}}'});
            {%endfor%}
        }).addPostLoadAction(function (dataTarget, menu, menuItem, reload) {
            let paginables = dataTarget.querySelectorAll('.grotte-paginable');
            for(let i=0; i<paginables.length; i++)
            {
                Grot(paginables[i]).loader();
            }
        });
        //add tab click to history
       // $('a[data-toggle="tab"]').on('click', function(e) {
       //     history.pushState(null, null, $(this).attr('href'));
       // });
        let hash = window.location.hash;//guardamos hash si existe
        let page = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);//guardamos el último elemento de la url
        if(hash!==''){ //existe hash
            page = page.replace(hash,"");//quitamos el hash del final de la url
            hash= hash.split('#')[1];//quitamos la almoadilla del hash
        }
        if(hash!=='' && document.getElementById(hash)){//intentamos primero el hash
            menuloader.load($('a[href="#'+ hash +'"]')[0]);
        }else{//el tab activo por defecto
            menuloader.load($('a.active')[0]);
        }
    });
