/*global window */

"use strict";

window.Graal = (function () {

    /* GraalObject */

    var GraalObject = function (dom) {
        this.listeners = {};
        this.id = dom.getAttribute("graal-id");
        this.DOMelement = dom;
        this.type = dom.getAttribute("graal-type") || dom.getAttribute("type") || dom.tagName.toLowerCase();
        this.pseudo = [];

        var that = this,
            t = null;

        if (this.type === "checkbox") {

            t = document.createElement("span");
            t.setAttribute("graal-type", "checkbox");

            if (that.DOMelement.checked) {
                t.setAttribute("graal-value", "true");                
            }

            t.addEventListener("click", function () {
                if (t.getAttribute("graal-value") === "true") {
                    t.setAttribute("graal-value", false);
                    that.DOMelement.checked = false;
                } else {
                    t.setAttribute("graal-value", true);
                    that.DOMelement.checked = true;
                }
            });
            this.DOMelement.parentNode.insertBefore(t, this.DOMelement.nextSibling);
        }

        if (this.type === "radio") {
            t = document.createElement("span");
            this.pseudo.push(t);
            t.setAttribute("graal-type", "radio");
            t.setAttribute("graal-render-id", this.id);

            if (that.DOMelement.checked) {
                t.setAttribute("graal-value", "true");                
            }

            t.addEventListener("click", function () {

                var pseudos = document.querySelectorAll("[graal-render-id=" + that.id + "]"),
                    i = 0;

                for (i = pseudos.length - 1; i >= 0; i -= 1) {
                    pseudos[i].setAttribute("graal-value", false);
                }

                if (t.getAttribute("graal-value") === "true") {
                    t.setAttribute("graal-value", false);
                    that.DOMelement.checked = false;
                } else {
                    t.setAttribute("graal-value", true);
                    that.DOMelement.checked = true;
                }
            });
            this.DOMelement.parentNode.insertBefore(t, this.DOMelement.nextSibling);
        }
    };

    GraalObject.prototype.bind = function (type, callback) {
        this.DOMelement.addEventListener("change", callback);
        this.listeners[type] = callback;
        return this;
    };

    var graal = {
        isReady : false,
        objects : {},
        doms: [],
        run : function () {

            window.onload = function () {

                var i = 0;

                graal.doms = document.querySelectorAll("[graal-id]");

                for (i = graal.doms.length - 1; i >= 0; i -= 1) {
                    graal.objects[graal.doms[i].getAttribute("graal-id")] = new GraalObject(graal.doms[i]);
                }

                graal.onReady();
                graal.isReady = true;
            };

        },
        ready : function (callback) {
            if (graal.isReady) {
                callback();
            } else {
                graal.onReady = callback;
            }
        },
        get : function (id) {
            return graal.objects[id];
        }
    };

    graal.run();
    return graal;

}());