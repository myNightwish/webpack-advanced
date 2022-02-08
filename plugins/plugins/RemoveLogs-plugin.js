// module.exports = class RemoveLogs {
//   constructor(options) {
//     this.options = options;
//     this.filename = "";
//   }

//   apply(compiler) {
//     compiler.hooks.compilation.tap("FileListPlugin", compilation => {
//       // compilation 创建之后执行
//       compiler.hooks.emit.tap("FileListPlugin", () => {
//         // 输出 asset 到 output 目录之前执行
//         let content = "\r\n";
//         console.log("资源列表及其size：");
//         // compilation.assets 存放当前所有即将输出的资源
//         Object.entries(compilation.assets).map(([pathname, source]) => {
//           content += `— ${pathname}: ${source.size()} bytes\r\n`;
//         });

//         console.log(content);
//         compilation.assets["README.md"] = {
//           source() {
//             return content;
//           },
//           size() {
//             return content.length;
//           }
//         };
//       });
//     });
//   }
// };

module.exports = class RemoveLogs {
  constructor(options) {
    this.options = options;
    this.filename = "";
  }

  apply(compiler) {
      console.log("Hello RemoveLogs!", this.options)
      compiler.hooks.compilation.tap('GetFileNamePlugin', compilation => {
        console.log(compilation.hooks.chunkIds)
        compilation.hooks.chunkIds.tap('GetFileNamePlugin', (c) => {
          this.filename = Array.from(c)[0].name
      });
      });
      compiler.hooks.done.tap("RemoveLogs", compilation => {
        const { path, filename } = compilation.options.output;
        let filePath = (path + "/" + filename).replace(/\\[name\\]/g, this.filename); 
    
        fs.readFile(filePath, "utf8", (err, data) => {
            const rgx = /console.log\\(['|"](.*?)['|"]\\)/;
            const newData = data.replace(rgx, "");
            if (err) console.log(err);
            fs.writeFile(filePath, newData, function (err) {
                if (err) {
                    return console.log(err)
                }
                console.log(filePath, "Logs Removed");
            });
        });
  
      })
  };
}

