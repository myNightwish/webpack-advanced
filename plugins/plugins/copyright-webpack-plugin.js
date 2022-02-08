// 插件是一个类
class CopyrightWebpackPlugin {
    constructor(){
        console.log('插件被使用了')
    }
    // 当调用插件时，会调用apply方法：该方法参数compiler，可理解为webpack的实例
    apply(compiler){
        compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
            console.log('compiler')
        })
        // compiler是webpack实例，存储了各种打包相关的实例
        // 里面有hooks，生命周期钩子函数
        // emit：将打包之后的代码放入dist目录之前的操作  它是异步的
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
           
            // compilation存放的是与本次打包相关的内容
            // 本次打包生成的文件都生成在compilation.assets下面，所以只需要在下卖弄加点东西就可以了
            compilation.assets['CopyrightWebpackPlugin.txt'] = {
                source: function(){
                    return 'copyRight by myNightwish'
                },
                size: function(){
                    return 30;
                }
            }
            console.log('emit钩子执行了');
            cb();
        })
    }
}


module.exports = CopyrightWebpackPlugin;