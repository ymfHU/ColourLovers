'use strict';
(function(window, document, undefined) {
    if (!window.jQuery) {
        console.log('[error] Missing dependency! (missing window.jQuery)');
        return;
    }
    var Mustache = window.Mustache;
    if (!Mustache) {
        console.log('[error] Missing dependency! (missing window.Mustache)');
        return;
    }
    var app,
        numResults = 20,
        offset=0,
        templates=[],
        tpl_item='item',
        tpl_dir='views/',
        tpl_ext='.mustache',

        timeAMPM = function (time){
            time = time.split(/:/);
            var ampm = time[0] >= 12 ? 'PM' : 'AM';
            time[0] = time[0] % 12;
            time[0] = time[0] ? time[0] : 12; // the hour '0' should be '12'
            time[1] = time[1] < 10 ? '0'+time[1] : time[1];
            return time[0]+':'+time[1]+' '+ampm;
        },

        formatDate = function (date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return timeAMPM(hours+':'+minutes);
        },

        loadData = function () {
            $.ajax({
                url: 'http://www.colourlovers.com/api/palettes/new?format=json&jsonCallback=callback&numResults='+numResults+'&resultOffset='+offset,
                dataType: "jsonp",
                jsonpCallback: 'callback'
            })
                .done(loadTemplate);
            offset+=numResults;
        },

        loadTemplate = function (response) {
            if (templates.hasOwnProperty(tpl_item)) {
                renderTemplate (templates[tpl_item], response);
                return;
            }

            $.get(tpl_dir+tpl_item+tpl_ext, function(template) {
                templates[tpl_item]=template;
                renderTemplate (templates[tpl_item], response);
            });

        },

        renderTemplate = function (template, response) {
            $.each(response, function(){
                var item_val = this;
                var date = item_val.dateCreated.split(/ /);
                item_val.timeCreated = timeAMPM(date[1]);
                var rendered = Mustache.render(template, item_val);
                $('.grid').append(rendered);
            });
            $('#last_update').html('Last updated at '+ formatDate(new Date())).show();

        };

    app = {
        loadData:loadData,
    };

    window.CLapp = app;
    window.CLapp.loadData();

})(window, document);
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

