function firtstotal() {
    var first = document.getElementById('a1').value;
    var second = document.getElementById('a2').value;
    document.getElementById('f1').value = (parseInt(first) * parseInt(second));

}
function secondtotal() {
    var first = document.getElementById('a2').value;
    var second = document.getElementById('b-1').value;
    document.getElementById('b-3').value = (parseInt(first) * parseInt(second));
}
function thirdtotal() {
    var first = document.getElementById('b-1').value;
    var second = document.getElementById('c-1').value;
    document.getElementById('c-3').value = (parseInt(first) * parseInt(second));
}
function fourthtotal() {
    var first = document.getElementById('c-3').value;
    var second = document.getElementById('d-2').value;
    document.getElementById('d-3').value = (parseInt(first) - parseInt(second));
}
function fifthtotal() {
    var first = document.getElementById('b-3').value;
    var second = document.getElementById('c-2').value;
    document.getElementById('e-3').value = (parseInt(first) - parseInt(second));
}
function sixtotal() {
    var first = document.getElementById('b-3').value;
    var second = document.getElementById('c-2').value;
    document.getElementById('e-3').value = (parseInt(first) - parseInt(second));
}
