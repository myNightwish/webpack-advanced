// loader就是一个函数：但不能写成箭头函数，因为要用this指向
module.exports = function(source){
    // 拿到传递的loader：但是它不是通过参数接收的，而是this
    // this中的query有很多参数
    // console.log('this.query', this.query)
    // 
    const result = source.replace('feier', this.query.name);
    // 假如我处理source之后，还想把source-map带出去，可以通过回调函数的形式
    this.callback(null, result);
}
