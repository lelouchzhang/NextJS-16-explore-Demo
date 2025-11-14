const $ = document.querySelector().bind(document);

const div = $('.upload-directory')
// 用于存储所有找到的文件
let allFiles = [];

// 转换任意div为可接受拖拽文件的div
div.ondragenter = e => {
    e.preventDefault();
}
div.ondragover = e => {
    e.preventDefault();
}

div.ondrop = async e => {
    e.preventDefault();
    allFiles = []; // 清空上一次结果

    // 统一封装：把 entry 递归读取成 File[]
    const walk = async (entry) => {
        if (entry.isFile) {
            // 文件 -> Promise<File>
            // 老派的写法，如果想使用await就要包装成promise实例
            const file = await new Promise((res, rej) => entry.file(res, rej));
            allFiles.push(file);
        } else if (entry.isDirectory) {
            // 目录 -> createReader 循环 readEntries
            const reader = entry.createReader();
            const readAll = () =>
                new Promise((resolve, reject) => {
                    const all = [];
                    const next = () =>
                        reader.readEntries(
                            batch => {
                                if (batch.length) {
                                    all.push(...batch);
                                    next(); // 继续读
                                } else resolve(all); // 读完了
                            },
                            reject
                        );
                    next();
                });
            const entries = await readAll();
            // 并发递归子条目
            await Promise.all(entries.map(walk));
        }
    };

    // 处理本次 drop 的所有 items
    const items = [...e.dataTransfer.items];
    for (const item of items) {
        const entry = item.webkitGetAsEntry();
        if (entry) await walk(entry);
    }

    console.log('全部文件:', allFiles); // 这里拿到扁平的 File[]
};