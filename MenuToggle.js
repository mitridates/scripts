/**
 * Create complex navigation menu
 * @class MenuToggle
 * @param {String} menuId Top container ID for menu items
 * @param {Object} options Options to initialize the component with
 */
function MenuToggle (menuId, options) {

    this.menuContainer  = document.getElementById(menuId);
    
    /**
     * NodeList elements in menu container
     * @name MenuToggle#menuNodeList
     * @type NodeList
     */
     Object.defineProperty(this, 'menuItemsNodeList', {
         set: function(){
             menuItemsNodeList= this.menuContainer.querySelectorAll(this.menuItemsSelector);
         }
     });    
    
    /**
     * Event emitter
     * @name MenuToggle#emitter
     * @type Object
     */
    Object.defineProperty(this, 'emitter', {
        value: (!EventEmitter && typeof EventEmitter != 'function')? null :  new EventEmitter(),
        writable: false
    });    
    
    //https://stackoverflow.com/questions/10490713/how-to-document-the-properties-of-the-object-in-the-jsdoc-3-tag-this
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/defineProperty
    /**
     * Div targets from menu items
     * @name MenuToggle#dataTargets
     * @type Array
     */
     Object.defineProperty(this, 'dataTargets', {
         value: [],
         set: function(){
             let i=0,
                 items= this.menuItemsNodeList;
             foreach(; i<items.length; i++){
                 dataTargets.push( document.querySelector(items[i].hash))
             }
         }
     });
}

MenuToggle.prototype = {
    menuItemsSelector: 'a',
    visitedSelector: 'color-visited',
    activeSelector: 'active'
};

MenuToggle.prototype.on = function (event, listener) {
    if(this.emitter) this.emitter.on(event, listener);
    return this;
};

/**
 * Init menu
 */
MenuToggle.prototype.init= function()
{
    let itemListener, menuItem,
        i=0,
        $this= this,
        getInitializerItem= function(){
           if (window.location.hash){
               return this.menuContainer.querySelector(this.menuItemsSelector+'[href="'+window.location.hash+'"]');
           }else{
               return this.menuContainer.querySelector(this.menuItemsSelector+'.'+this.activeSelector); 
           }else{
               return null;
           }
        };
    


    for(; i<this.menuItemsNodeList.length; i++){
        itemListener = {
            el: this.menuItemsNodeList[i],
            handleEvent: function (event) {
                if (event.type === 'click') {
                    if($this.emitter) {
                        /**
                         * Event for this menu element
                         * @example menuToggle.on('click.dataTargetId', function(menuItem, dataTarget){})
                         */
                        $this.emitter.emit('click.'+this.el.hash.substr(1), this.el, document.querySelector(this.el.hash));
                        /**
                         * Event for all menu elements
                         * @example menuToggle.on('click', function(menuItem, dataTarget){})
                         */
                        $this.emitter.emit('click', this.el, document.querySelector(this.el.hash));
                    }
                    history.pushState(null, null,  this.el.href)
                    event.preventDefault();
                    $this.show(this.el)
                }
            }
        };

        this.menuItemsNodeList[i].addEventListener('click', itemListener, false);
    }

    this.updateHistory()
    
       
    menuItem.click();
    
};

/**
 * Load hash || active || first item
 * return self
 */
MenuToggle.prototype.loadHashOrDefault= function()
{
    let menuItem, i=0,
        source= ['[href="'+window.location.hash+'"]', '.'+this.activeSelector, ''];

    for(;i<source.length;i++){
        menuItem = this.menuContainer.querySelector(this.menuItemsSelector+source[i]);
        if(menuItem) break;
    }
    menuItem.click();

    return this;
};


/**
 * @todo
 * Add hash to history to use back and forward buttons/keyboard sort cut
 * return {NULL}
 * @param {Object} menuItem Menu link
 */
MenuToggle.prototype.updateHistory= function()
{
    let $this= this,
        popstateEvent ={
            handleEvent: function (event) {
              let currentHistorySelector= $this.menuContainer.querySelector($this.menuItemsSelector+'[href="'+window.location.hash+'"]');
                  //lastActiveSelector = $this.menuContainer.querySelector('.'+$this.activeSelector);
                $this.show(currentHistorySelector);
            }
        };
    // navigate to a tab when the history changes
    window.addEventListener("popstate", popstateEvent);
};


/**
 * Load div
 * @param {Object} menuItem Menu link
 */
MenuToggle.prototype.show= function(menuItem)
{
    let el, i=0,
        previous= this.menuContainer.querySelector('.'+this.activeSelector),
        dataTarget  = document.querySelector(menuItem.hash);

    if(typeof dataTarget === "undefined")
    {
        console.log('Target hash ID desconocido: '+ menuItem.hash);
        return false;
    }


    if(previous) previous.classList.remove(this.activeSelector);

    menuItem.classList.add(this.activeSelector, this.visitedSelector);

    for (; i < this.targetsContainer.children.length; i++)
    {
        el = this.targetsContainer.children[i];
        el.style.display = 'none';

        if(this.emitter)
        {
            /**
             * Hide event for for all menu elements
             * @example menuToggle.on('click.dataTargetId', function(menuItem, dataTarget){})
             */
            this.emitter.emit('hide', el);
            /**
             * Hide event for this menu element
             * @example menuToggle.on('hide.dataTargetId', function(dataTarget){})
             */
            this.emitter.emit('hide.' + el.id, el);
        }
    }

    dataTarget.style.display= 'inline';

    if(this.emitter)
    {
        /**
         * Show event for this menu element
         * @example menuToggle.on('hide.dataTargetId', function(dataTarget){})
         */
        this.emitter.emit('show.'+dataTarget.id, dataTarget);
    }
};
