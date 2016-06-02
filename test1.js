function bind(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
}

var user = {
    firstName: "Вася",
    sayHi: function() {
        console.log( this.firstName );
    }
};

setTimeout(bind(user.sayHi, user), 1000);
setTimeout(user.sayHi.bind(user), 1000);

// Создаётся объект promise
var promise = new Promise((resolve, reject) => {

   /* setTimeout(() => {
        // переведёт промис в состояние fulfilled с результатом "result"
        resolve("result");
    }, 2000);*/

    setTimeout(() => {
        reject(new Error("время вышло!"));
    }, 1000);

});

// promise.then навешивает обработчики на успешный результат или ошибку
promise
    .then(
        result => {
            // первая функция-обработчик - запустится при вызове resolve
            console.info("Fulfilled: " + result); // result - аргумент resolve
        },
        error => {
            // вторая функция - запустится при вызове reject
            console.info("Rejected: " + error); // error - аргумент reject
        }
    );

var data = '{"name":"Has Error"}'; // в данных ошибка

try {

    var user = JSON.parse(data); // <-- ошибка при выполнении
    console.info( user.name ); // не сработает

} catch (e) {
    // ...выполнится catch
    console.info( "Извините, в данных ошибка, мы попробуем получить их ещё раз" );
    console.info( e.name );
    console.info( e.message );
}


function httpGet(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}


// сделать запрос
httpGet('cv.json')
// 1. Получить данные о пользователе в JSON и передать дальше
    .then(response => {
        //console.log(response);
        var user = JSON.parse(response);
        return user;
    })
    // 2. Получить информацию с github
    .then(user => {
        console.log(user);
        return httpGet(`https://api.github.com/users/sonik9`);
    })
    // 3. Вывести аватар на 3 секунды (можно с анимацией)
    .then(githubUser => {
        console.log(githubUser);
        githubUser = JSON.parse(githubUser);
        var img = new Image();
        img.src = githubUser.avatar_url;
        img.className = "promise-avatar-example";
        document.body.appendChild(img);

        setTimeout(() => img.remove(), 3000); // (*)
    });


var user = {
    firstName: "Вася",
    surname: "Петров",

    get fullName() {
        return this.firstName + ' ' + this.surname;
    },

    set fullName(value) {
        var split = value.split(' ');
        this.firstName = split[0];
        this.surname = split[1];
    },
    toString: function () {
        return this.firstName;
    }
};
for(var i=0; i<10; i++) {
    setTimeout(function() {
        console.log(i);
    }, 100);
}
