// 打包工具在这里写  它依赖于node  so记得提前安装喔
// 读取入口文件，分析入口文件的代码
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const babel = require('@babel/core')


// 1. 定义一个函数
const moduleAnalyser = (filename) => {
    // 1.1 读取文件出来,content就是文件本身内容
    const content = fs.readFileSync(filename, 'utf-8')
    // 1.2 提取引入文件：message.js  字符串截取不灵活
    // 引入一个第三发模块：npm i @babel/parser -d  可以帮助我们分析源代码
    // 得到抽象语法树
    const ast = parser.parse(content, {
        // 如果入口文件时es6 的引入方式，需要传入sourceType为module
        // 此时打印出来的就是抽象语法树
        sourceType: "module"
    })
    // 1.3 分析语法树,参数2 遍历时需要找到什么类型的元素
    const dependencies = {}; // 存遍历中遇到的依赖，但内部的value属性就可以得到引入的啥文件
    traverse(ast, {
        // 要写成函数，这个节点的内容里包含node
        ImportDeclaration({ node }){
            // 拿到filename对应的文件夹路径
            const dirname = path.dirname(filename);
            const newPath = './'+path.join(dirname, node.source.value);
            dependencies[node.source.value] = newPath;
        }
    })
    // 1.4 babel的transformFromAst可以将ast语法树转化成浏览器可以识别的语法
    // 里面有code字段，它就是浏览器编译运行的可以在浏览器上生成运行的代码
    const {code} = babel.transformFromAst(ast, null, {
        // 转换过程中，可以用的东西 npm i @babel/preset-env -d
        presets: ['@babel/preset-env']
    })
    return {
        filename,
        dependencies,
        code
    }

}

// 2.最开始对入口文件做分析
// module.exports = moduleAnalyser('./src/index.js');


// 1. 依赖图谱：存储所有模块的模块信息
const makeDependenciesGraph = function(entry){
    const entryModule = moduleAnalyser(entry);
    // 1.1 对所有的依赖分析:队列遍历
    const graphArr = [entryModule];
    for(let i = 0; i<graphArr.length; i++){
        //1.2 拿出这个模块
        const item = graphArr[i];
        // 1.3 拿出这个依赖
        const { dependencies } = item;
        // 1.4 对对象里的文件进一步做分析
        if(dependencies){
            // 存储时，存的是对象，递归分析
            for(let j in dependencies){
                graphArr.push(moduleAnalyser(dependencies[j]))
            } 
        }
    }
    // 2. 此时就拿到了这个图谱数组：但打包后为了方便处理，还要格式转换 
    const graph = {};
    graphArr.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    return graph
}


// 1. 生成浏览器可以运行的代码
const generateCode = entry => {
    const graph = JSON.stringify(makeDependenciesGraph(entry));
    // 1.1 最终生成的代码，实际上是字符串
    // 1.2 网页中的所有代码应该放在一个闭包里执行，避免污染全局环境
    // 1.6 现在graph中的代码中有require、exports对象，但是浏览器不识别，所以还需要转换：构造require、exports
    return `(function(graph){
        function require(module){
            function localRequire(relativePath){
                return require(graph[module].dependencies[relativePath])
            }

            var exports = {};
            (function(require, exports, code){
                eval(code)
            })(localRequire, exports, graph[module].code)
            return exports;
        }
        require('${entry}')
    })(${graph})`
    // 1.3 注意这里不能直接${graph}  不然打印出来就是[object object] 对象会被toString方法
    // 1.4 so 传入之前要stringfy
}
const code = generateCode('./src/index.js');
console.log(code)