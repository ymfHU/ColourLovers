'use strict';
(function(window, document, undefined) {
    if (!window.jQuery) {
        console.log('[error] Missing dependency! (missing window.jQuery)');
        return;
    }
    var app = window.CLapp;
    if (!app) {
        console.log('[error] App not loaded! (missing window.CLapp)');
        return;
    }
    var Mustache = window.Mustache;
    if (!Mustache) {
        console.log('[error] Missing dependency! (missing window.Mustache)');
        return;
    }
    var
        initScroll = function () {
            $(window).scroll(function() {
                if($(window).scrollTop() + $(window).height() > $(document).height()/1.5) {
                    loadMore();
                }
            });
        },
        loadMore = function() {
        app.loadData();
        };

    app.scroll = {
        initScroll:initScroll,
        loadMore:loadMore
    };

    app.scroll.initScroll();
})(window, document);

