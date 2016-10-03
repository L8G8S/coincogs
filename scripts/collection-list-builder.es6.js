'use strict';

class CollectionListBuilder {
        
    build(item) {
       if(item && item.element === undefined) {
            let element = document.createElement('li');
            
            let imageValue = item.images && item.images.length > 0 ? item.images[0] : '';
            let yearValue = item.year || '';
            let gradeValue = item.grade || '';

            element.innerHTML = '<div class="coin">' + 
                                    `<img class="image" src="${imageValue}" />` +
                                    `<div class="info"><span>${yearValue}</span><span>${gradeValue}</span></div>` + 
                                '</div>';

            return element;
        }
        
        return null;
    }
}