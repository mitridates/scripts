    /**
     * Gestiona un menú cuyos items referencian a un div oculto
     * @class
     * @constructor
     * @name Menuloader
     * @param {Object} menu
     * @param {Object} targetsContainer
     */
    function Menuloader (menu, targetsContainer) {
        this.menu  = menu;
        this.targetsContainer = targetsContainer;
        this.postloadAction = [];
        this.lastActiveMenuItem= false;
    }
    /**
     * Add functions to run before load
     * @param {Function} func(dataTarget, menu, menuItem, reload)
     * @return self
     */
    Menuloader.prototype.addPostLoadAction= function(func)
    {
        this.postloadAction.push(func);
        return this;
    };
    /**
     * show data
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
     * @param {boolean} [reload] reload tab?
     */
    Menuloader.prototype.load= function(menuItem, reload)
    {
        let dataTarget  = document.querySelector(menuItem.hash) ;
        $this = this;
        if(typeof dataTarget === 'undefined'){
            console.log('Target hash ID desconocido: '+ menuItem.hash);
            return false;
        }
        //window.history.pushState(null, null, menuItem.href);
        document.location.hash = menuItem.hash;
        let updateTab = function(){
            menuItem.dataset.loaded = "true";
            for(let i=0; i<$this.postloadAction.length; i++){
                $this.postloadAction[i](dataTarget, $this.menu, menuItem, reload);
            }
        };
        if(!dataTarget.dataset.path && menuItem.dataset.loaded !== "true"){
            updateTab();
        }else if(reload || menuItem.dataset.loaded !== "true"){
            dataTarget.innerHTML= '<div class="text-center">{{'loading'|trans({},'cavemessages')|raw}}</div>';
            Grot(dataTarget).loader({}, {'success': updateTab});
        }
        this.menu.querySelector('.active').classList.remove('active')
        menuItem.classList.add('active');
        this.lastActiveMenuItem = menuItem
        this.showData(dataTarget);
    };
