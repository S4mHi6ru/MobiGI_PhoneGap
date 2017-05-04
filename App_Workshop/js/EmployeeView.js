/**
 * Created by S4m-PC on 04.05.2017.
 */
var EmployeeView = function (employee) {

    this.initialize = function () {
        this.el = $('<div/>');
    };

    this.render = function () {
        this.el.html(EmployeeView.template(employee));
        return this;
    };

    this.initialize();

};

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());