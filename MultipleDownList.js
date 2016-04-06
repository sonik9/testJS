/**
 * Created by Vitalii on 6/04/2016.
 */
'use strict';

(function () {

    function MultipleDownList(node,structure) {
        this.root = node;
        this.structure = structure;
        this.mdl = this._createMDL(this.structure,this);
        this.mel = this._createMEL(this.structure);
        this.root.appendChild(this.mel);
        this.root.appendChild(this.mdl);
        var div = document.querySelector(".editablePanel");
        var ul = div.firstElementChild;
        var len = 0;
        Array.prototype.forEach.call(ul.childNodes, function (item) {
            len += item.offsetWidth;
        });
        if (div.offsetWidth <= len) {
            div.style.width = len + 50 + "px";
        }
        return this;
    }

    MultipleDownList.prototype._createMEL = function (structure) {
        var divElement = document.createElement("div");
        divElement.setAttribute("class", "editablePanel")
        var ulElement = document.createElement("ul");
        var editElement = document.createElement("input");
        editElement.setAttribute("type", "edit");
        for (var i = 0; i <= structure.length; i++) {

                var liElement = document.createElement("li");
                liElement.style.listStyleType = 'none';
                if (i === structure.length) {
                    liElement.appendChild(editElement);
                }
                else {
                    if (structure[i].checked) {
                        liElement.innerText = structure[i].title;
                    }
                }
                ulElement.appendChild(liElement);
        }
        divElement.appendChild(ulElement);

        return divElement;
    }

    MultipleDownList.prototype._createMDL = function (structure,context) {
        var ulElement = document.createElement("ul");
        if (typeof structure === "object") {
            structure.forEach(function (item, index) {
                var liElement = document.createElement("li");
                liElement.style.listStyleType = 'none';
                var spanElement = document.createElement("span");
                var chkElement = document.createElement("input");
                chkElement.setAttribute("type", "checkbox");
                chkElement.addEventListener("change",function (event) {
                    if(this.checked){
                        var title = this.nextSibling.textContent;
                        //debugger;
                        structure.forEach(function (item) {
                           if(item.title===title) {
                               item.checked = true;
                           }
                        });
                        //debugger;
                        console.log(context.root);
                        context.root.innerHTML="";
                        new MultipleDownList(context.root,structure);
                    }else
                    {
                        var title = this.nextSibling.textContent;
                        structure.forEach(function (item) {
                            if(item.title===title) {
                                console.log(item.title)
                                item.checked = false;
                            }
                        });
                        //context.root.removeChild(context.root.firstChild);
                        context.root.innerHTML="";
                        new MultipleDownList(context.root,structure);
                    }
                });
                if (item.checked) {
                    chkElement.setAttribute("checked", "checked");
                }
                spanElement.innerText = item.title;
                liElement.appendChild(chkElement);
                liElement.appendChild(spanElement);
                ulElement.appendChild(liElement);
            });
        }
        console.log(ulElement);
        return ulElement;

    }
    
    MultipleDownList.prototype._delMenuNode = function (MultipleDownList) {
        console.log(MultipleDownList.root);
    }


    window.MultipleDownList = MultipleDownList;
}());
