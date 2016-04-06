/**
 * Created by sonik9 on 17.03.16.
 */
function sum() {
    var s;
    if (typeof arguments[0] === 'string')
        s = '';
    else
        s = 0;
    for (var i in arguments) {

        s += arguments[i];
    }
    return console.log(s);
}

sum(10, 20);

function isInArray(arr) {
    var mas;
    var bool = false;
    if (typeof arguments[0] === 'object') {
        mas = arguments[0];
        for (var i in arguments) {
            if (mas.indexOf(arguments[i]) != -1) {
                bool = true;
            }
            else
                bool = false;
        }
        return bool;
    }
    else {
        console.log("bad array");
        return bool;
    }
}
console.log(isInArray([1, 2], 1, 2, 3));

function every(arr, func) {
    var bool=false;
    for (var i=0; i<arr.length;i++) {
        if(func(arr[i], i, arr)){
          bool=true;
        }
        else
        bool =false;
    }
    return bool;
}
var arr = ['one', 'two', 'three', NaN];
console.log(
every(arr, function (elem, index, array) {
    return typeof elem === 'string';
}));
///////////
function execFunctions(arrOfFunctions) {
    var mas=[];

    for(var i in arrOfFunctions){
        mas.push(arrOfFunctions[i]());

    }

    return mas;

}

console.log(execFunctions([function(){return 10;},function(){return 20;}]));


function getName(path) {
    var s=path.split('/');
    var a=[];

    for(var i in s){
        if(s[i]!=""){
            a.push(s[i]);
        }
    }
return a.pop();
}
function getName(path) {
    return path.split("/").reduceRight(function (prev,pathSegment) {
        return prev || pathSegment;
    },"");
}
console.log(getName('home/sonik9/Download'));