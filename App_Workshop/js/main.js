var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    // apps register function
    registerEvents: function () {
        var self = this;
        $(window).on('hashchange', $.proxy(this.route, this));
        $('body').on('mousedown', 'a', function (event) {
            $(event.target).addClass('tappable-active');
        });
        $('body').on('mouseup', 'a', function (event) {
            $(event.target).removeClass('tappable-active');
        });

    },

    route: function () {
        var hash = window.location.hash;
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return
        }
        var match = hash.match(app.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function (employee) {
                $('body').html(new EmployeeView(employee).render().el);
            });
        }
    },

    // apps initialize function
    initialize: function() {
        var self = this;
        this.detailsURL = /^#employees\/(\d+)/;
        this.registerEvents();
        this.store = new MemoryStore(function () {
            self.route();
        });
    }

};

app.initialize();