"use strict";
/**
 * Created by Vitalii on 29/03/2016.
 */
//module user {
var user = function () {
    function user(name, age) {
        this._name = name;
        this._age = age;
    }
    return user;
}();
exports.user = user;

(function f() {
    var user = new user("wetal", 29);
    console.log("name:" + user.name + " age:" + user._age);
})();
//} 
//# sourceMappingURL=user.js.map