/**
 * Created by Vitalii on 24/03/2016.
 */
function toArray(obj) {
    var arr = [];
    return (function () {
        for (var i in obj) {
            if (i != 'length')
                arr.push(obj[i]);
        }
        return arr;
    })();
}

/*
 var f = toArray({});
 console.log(f());
 */


function someFunc() {
    var args = toArray(arguments);
    console.log(arguments.forEach); // undefined, метод есть только у массивов.
    console.log(args.forEach); // [function], метод есть только у массивов.
}

someFunc(1, 2, 3, 4);

function toArray1(obj) {
    var args = [];
    for (var i = 1; i <= obj.length; i++)
        args.push(obj[i]);
    return args;
}
console.log(toArray({1: 'one', 2: 'two', 3: 'three', length: 3}));

/*
 var obj = arr.reduce(function(o, v, i) {
 o[i] = v;
 return o;
 }, {});
 */

function queryStringToObject(queryString) {
    var obj = {};
    function mas() {
        return queryString.split("&").reduce(function (previousValue, currentValue, currentIndex, array) {
            array[currentIndex] = currentValue;
            return array;
        }, []);
    };
    return mas().reduce(function (previousValue, currentValue, currentIndex, array) {
        currentValue.split("=").reduceRight(function (previousValue, currentValue, currentIndex) {
            if(!isNaN(previousValue)){
                obj[currentValue]=parseInt(decodeURIComponent(previousValue));
            }else if(previousValue==="true"){
                obj[currentValue]=true;
            }else if(previousValue==="false"){
                obj[currentValue]=false;
            }else
                obj[currentValue]=decodeURIComponent(previousValue);
        });
        return obj;
    },{});
}
//console.log(queryStringToObject('wtf=%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B0%3D%D1%85%D0%BB%D0%B5%D0%B1%2C%D0%BC%D0%B0%D1%81%D0%BB%D0%BE%3D%D0%B6%D1%8B%D1%80'));
console.log(queryStringToObject("user=true&age=29&name=Evgen"));

function sum (a, b) {
    return a + b;
}

var addSeven = sum.bind(null,0);

console.log(addSeven(9));