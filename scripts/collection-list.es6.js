'use strict';

class CollectionList {
    constructor(element){

        if(!element){
            throw new DOMException('element is null or empty');
        }

        if(element.collCtl) return null;

        element.collCtl = this;
        
        this._items = new Set();
        this._builder = new CollectionListBuilder();
                
        this._element = element;
        this._content = element.querySelector('ul');
        this._sourceUrl = element.getAttribute('data-source');
        this._saveUrl = null;
     
        let self = this;
        /*
        this._handleEditorKeyUpProxy = function handleEditorKeyUpProxy () { self.handleEditorKeyUp.apply(self, [...arguments]); };
        this._handleAddItemProxy = function handleAddItemProxy () { self.handleAddItem.apply(self, [...arguments]); };
        this._handleRemoveItemProxy = function handleRemoveItemProxy () { self.handleRemoveItem.apply(self, [...arguments]); };
        this._handleItemKeyUpProxy = function handleItemKeyUpProxy () { self.handleItemKeyUp.apply(self, [...arguments]); };
        this._handleItemChangeProxy = function handleItemChangeProxy () { self.handleItemChange.apply(self, [...arguments]); };
        */
        
        this.initialize();
    }
    
    initialize() {
        if(this._sourceUrl === null) return;
        
        this._isInitializing = true;
        
        // 
        if(!this._content) {
            this._content = document.createElement('ul');
            this._element.appendChild(this._content);
        }
        
        // gather items from source       
        let self = this;      
        Ajax.getJSON(this._sourceUrl, false).then(function(data) {

            if(!data.items) return;

            self._content.innerHTML = '';

            data.items.forEach(function(value) { self.addItem(value); });
                
            self._isInitializing = false;
        });
    }
    
    appendItemElement(item) {
        let element = this._builder.build(item);
        
        if(element) {
            element.data = item;
            item.element = element;
                        
            this._content.appendChild(element);
            
            if(!this._isInitializing) element.focus();
        }
    }

    hasItem(item) {
        if(this._items.has(item)) return true;
                
        let match = Array.from(this._items).find(function(i){ return (i.year === item.year); });
        if(match) return true;
        
        return false;
    }
    
    getItem(year) {
        let match = Array.from(this._items).find(function(i){ return (i.year === year); });
        if(!match) return null;
        
        return match;
    }
    
    addItem(item) {        
        if(this.hasItem(item)) return; 
        
        this._items.add(item);
        this.appendItemElement(item);
        
        if(!this._isInitializing && this._saveUrl !== null) {
            /*
            let itemsToSave = Array.from(this._items).map(function(item) { return { id:item.id, text:item.text}; });
            
            if(itemsToSave.length > 0) {
                Ajax.postJSON(this._saveUrl, { 
                    type: this._type, 
                    data: JSON.stringify(itemsToSave) 
                }).then(function(response) { 
                    console.log(response); 
                });
            }
            */
        }
    }
    
    removeItem(item) {
        let match = this.getItem(item.year);
        if(match === null) return;
        
        this._items.delete(match);
        
        if(match.element){
            this._element.querySelector('.content').removeChild(match.element);
            match.element.data = undefined;
            match.element = undefined;  
        } 
    }
    
    static create(selector) {
        Array.from(document.querySelectorAll(selector)).forEach(function(element) {
            new CollectionList(element);
        });
    }
}