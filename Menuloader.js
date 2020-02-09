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
        this.menuItemsSelector= 'a';
        this.targetsContainer = targetsContainer;
        this.lastActiveMenuItem= false;
    }

    /**
     * Get menu items
     * return {NodeList}
     */
    Menuloader.prototype.getMenuItems= function()
    {
        return document.querySelectorAll(this.menuItemsSelector);
    };  
    
    /**
     * Show data
     * @param {Object} dataTarget data div container
     */
    Menuloader.prototype.showContainerDiv= function(dataTarget)
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
     * @param {boolean} [reload] reload content
     */
    Menuloader.prototype.load= function(menuItem)
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

        // Update menuItems
        menuItem.dataset.loaded = "true";
        this.menu.querySelector('.active').classList.remove('active')
        menuItem.classList.add('active');
        this.lastActiveMenuItem = menuItem
        this.showContainerDiv(dataTarget);
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
        
        menuloader.addPreLoadAction(function (dataTarget, menu, menuItem, reload){}, true)
        
        
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
