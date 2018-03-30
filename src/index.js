function App() {

}

App.prototype.title = "app demo";
App.prototype.getTitle = function () {
    return this.title;
}
console.log(App.prototype);



var app1 = new App();
var app2 = new App();
console.log(app1.title);
console.log(app2.title);
console.log(app1.getTitle())
console.log(app2.getTitle())


//problem
function Header(title) {
    this.title = title;
}
App.prototype.header = new Header("header1");
console.log(app1.header.title);
console.log(app2.header.title);
app1.header.title = 'header2';
console.log(app1.header.title)
console.log(app2.header.title)

//solution
//constructor & prototype
function Header2(title) {
    this.title = title;
}

function App2() {
    this.header = new Header2('app1')
}
var app1 = new App2()
var app2 = new App2()
console.log('App2:' + app1.header.title);
console.log('App2:' + app2.header.title);

app1.header.title = 'app1  demo';
console.log('App2:' + app1.header.title);
console.log('App2:' + app2.header.title);