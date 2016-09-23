'use strict';

class EditableList {
    constructor(element){
        if(!element){
            throw new DOMException('element is null or empty');
        }

        if(element.editCtl) return null;

        element.editCtl = this;
        
        this._items = new Set();
                
        this._element = element;
        this._type = element.getAttribute('data-type');
        this._sourceUrl = element.getAttribute('data-source');
        this._saveUrl = element.getAttribute('data-save');
     
        let self = this;
        this._handleEditorKeyUpProxy = function handleEditorKeyUpProxy () { self.handleEditorKeyUp.apply(self, [...arguments]); };
        this._handleAddItemProxy = function handleAddItemProxy () { self.handleAddItem.apply(self, [...arguments]); };
        this._handleRemoveItemProxy = function handleRemoveItemProxy () { self.handleRemoveItem.apply(self, [...arguments]); };
        this._handleItemKeyUpProxy = function handleItemKeyUpProxy () { self.handleItemKeyUp.apply(self, [...arguments]); };
        this._handleItemChangeProxy = function handleItemChangeProxy () { self.handleItemChange.apply(self, [...arguments]); };
        
        this.initialize();
    }
    
    initialize() {
        if(this._sourceUrl === null) return;
        
        this._isInitializing = true;
        
        // get the template content
        let template = document.querySelector('#editable-list-template').import.querySelector('template');
        let content = document.importNode(template.content, true);

        // replace/inject the temlate content
        this._element.innerHTML = '';
        this._element.appendChild(content);
        this._content = this._element.querySelector('.content');

        // gather items from source       
        let self = this;      
        Ajax.getJSON(this._sourceUrl, false).then(function(data) {
            // udpate/set the title
            self._element.querySelector('.title').innerHTML = data.title;

            if(!data.values) return;

            data.values.forEach(function(value) { self.addItem(value); });
            
            // second check (there may be few items put in the markup)
            let itemElements = Array.from(self._content.querySelectorAll('.item'));
            itemElements.forEach(function (itemElement) {
                if(itemElement.data === undefined)
                {
                    itemElement.data = { 
                        text: itemElement.firstElementChild.innerText,
                        element: itemElement
                    };
                    
                    self._items.add(itemElement.data);
                }
            });

            // register event handlers
            let editor = self._element.querySelector('.item.blank > .editor');
            if(editor) editor.addEventListener('keyup', self._handleEditorKeyUpProxy, true);

            itemElements.forEach(function (itemElement) {
                let addButton = itemElement.querySelector('.button.add');
                let removeButton = itemElement.querySelector('.button.remove');
                
                if(addButton !== null) 
                    addButton.addEventListener('click', self._handleAddItemProxy);
                
                if(removeButton !== null) 
                    removeButton.addEventListener('click', self._handleRemoveItemProxy);
            });
    
            self._isInitializing = false;
        });
    }
    
    handleEditorKeyUp(evt) {
        if(evt.which === 13) this.handleAddItem(evt);
    }
    
    handleAddItem(evt) {
        let node = evt.srcElement || evt.target;

        while(node !== null && !node.classList.contains('item')) node = node.parentNode;
        if(node === null) return;
        
        this.clearItemElementFocus();
        
        let match = this.getItem(node.firstElementChild.value);
        if(match === null) {
            this.addItem({ text: node.firstElementChild.value });

            let editor = node.querySelector('.editor');
            if(editor) {
                editor.value = "";
                editor.focus();
            }   
        }
        else {
            match.element.classList.add('focused');
        }
    }
    
    handleRemoveItem(evt) {
        let node = evt.srcElement || evt.target;
        
        while(node !== null && !node.classList.contains('item')) node = node.parentNode;
        if(node === null) return;
        
        this.clearItemElementFocus();
        this.removeItem(node.data);
    }

    handleItemKeyUp(evt) {
        let textbox = evt.srcElement || evt.target;

        let node = textbox;
        while(node !== null && !node.classList.contains('item')) node = node.parentNode;
        if(node === null) return;

        if(textbox.value !== node.data.text) node.classList.add('dirty');
        else node.classList.remove('dirty');
    }

    handleItemChange(evt) {
        let textbox = evt.srcElement || evt.target;

        let node = textbox;
        while(node !== null && !node.classList.contains('item')) node = node.parentNode;
        if(node === null) return;

        if(textbox.value === ''){
            textbox.value = node.data.text;
            node.classList.remove('dirty');
        }
        else if(node.classList.has('dirty')) {

        }
    }
    
    buildItemElement(item) {
        if(item && item.element === undefined) {
            let node = document.createElement('div');
            
            node.classList.add('item');
            node.setAttribute('tabindex', '1');
            node.innerHTML = '<input type="text" /><a class="button remove" title="Remove this value"></a>';
            node.firstElementChild.value = item.text;
             
            return node;
        }
        
        return null;
    }
    
    appendItemElement(item) {
        let node = this.buildItemElement(item);
        
        if(node) {
            node.data = item;
            item.element = node;
                        
            this._content.appendChild(node);
            
            let textbox = node.firstElementChild;
            if(textbox !== null){
                textbox.addEventListener('keyup', this._handleItemKeyUpProxy, true);
                textbox.addEventListener('change', this._handleItemChangeProxy, true);
            }
                        
            let removeButton = node.querySelector('.button.remove');
            if(removeButton !== null) removeButton.addEventListener('click', this._handleRemoveItemProxy);
            
            if(!this._isInitializing) node.focus();
        }
    }
    
    clearItemElementFocus() {
        let focused = Array.from(this._element.querySelectorAll('.item.focused'));
        focused.forEach(function(item) {
            item.classList.remove('focused');
        });
    }
    
    hasItem(item) {
        if(this._items.has(item)) return true;
                
        let match = Array.from(this._items).find(function(i){ return (i.text === item.text); });
        if(match) return true;
        
        return false;
    }
    
    getItem(itemText) {
        let match = Array.from(this._items).find(function(i){ return (i.text === itemText); });
        if(!match) return null;
        
        return match;
    }
    
    addItem(item) {        
        if(this.hasItem(item)) return;   
        
        this._items.add(item);
        this.appendItemElement(item);
        
        if(!this._isInitializing && this._saveUrl !== null) {
            let itemsToSave = Array.from(this._items).map(function(item) { return { id:item.id, text:item.text}; });
            
            if(itemsToSave.length > 0) {
                Ajax.postJSON(this._saveUrl, { 
                    type: this._type, 
                    data: JSON.stringify(itemsToSave) 
                }).then(function(response) { 
                    console.log(response); 
                });
            }
        }
    }
    
    removeItem(item) {
        let match = this.getItem(item.text);
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
            new EditableList(element);
        });
    }
}