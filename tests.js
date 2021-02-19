let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let d = new Date().toLocaleDateString('en-US',options);
console.log(d);