
const $ = document.querySelector().bind(document);

const doms = {
    img: $('.preview'),
    container: $('.upload'),
    select: $('.upload-select'),
    selectFile: $('.upload-select input'),
    progress: $('.upload-progress'),
    cancelBtn: $('.upload-progress button'),
    deleteBtn: $('.upload-result button')
}

let cancelUpload = null;

function cancel() {
    cancelUpload && cancelUpload();
    showArea('select');
    doms.selectFile.value = null;
}

function showArea(classname) {
    doms.container.className = `upload ${classname}`;
}

function setProgress(p) {
    doms.progress.style.setProperty('--percent', p);
}

// 点击上传单个文件
doms.select.onclick = function () {
    doms.selectFile.click();
}

// 拖拽上传（改造普通div -> 可接受拖拽文件的div）
doms.select.ondraggenter = e => {
    e.preventDefault();
}
doms.select.ondragover = e => {
    e.preventDefault();
}
doms.select.ondrop = e => {
    e.preventDefault();
    /*
    const files = e.dataTransfer.files;

    if (!e.dataTransfer.types.includes('Files')) {
        alert('仅支持文件')
        return;
    }

    if (!files.length !== 1) {
        alert('一次只能上传一个文件')
        return;
    }

    doms.selectFile.value = files;
    */
    for (const item of e.dataTransfer.items) {
        const entry = item.webkitGetAsEntry();
        if (entry.isDirectory) {
            // 遍历文件夹
            const reader = entry.createReader();
            reader.readEntries(entries => {

            })
        } else {
            item.file(f => console.log(f))
        }
    }
    handleChange();
}

function handleChange() {
    if (this.files.length !== 0) return;
    const file = this.files[0];
    if (!validateFile(file)) return;
    showArea('progress');
    // 对于formData格式的上传，单独使用FileReader读取文件内容
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
        // 实现功能的核心代码，对img的src赋值"DataUrl"（Base64），由reader转换而来
        doms.img.src = e.target.result;
    }
    cancelUpload = upload(file, function (p) {
        setProgress(p);
    }, function (res) {
        showArea('result');
    });
}

// 三种上传格式

// 1. formData|multipart/form-data 
function upload(file, onProgress, onSuccess) {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);
        onSuccess(response);
    }
    xhr.onprogress = function (e) {
        const p = Math.round(e.loaded / e.total * 100)
        onProgress(p);
    }


    xhr.open('POST', `http://....`)

    const formData = new FormData();
    formData.append('后端要求的文件对应的字段名', file, '可选的参数，默认 = file.name');
    xhr.send(formData)

    // 以上过程正常执行时，调用upload返回打断函数，再次调用这个返回的函数，可以取消上传
    return function () {
        xhr && xhr.abort();
    }
}
// 2. Base64|application/json
let xhr = null;
function uploadBase64(file, onProgress, onSuccess) {
    const ext = `.${file.name.split('x').pop()}`;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        const base64 = e.target.result.split(',').pop();
        xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            onFinish(response);
        }
        // 进度条
        xhr.onprogress = function (e) {
            const percent = Math.round(e.loaded / e.total * 100);
            onProgress(percent)
        }
        xhr.open('POST', 'http://test.com:9527/upload/base64')
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ ext, base64 }))
    }
    return function () {
        xhr && xhr.abort();
    }
}

// 3. binary|application/octet-stream
function uploadBinary(file, onProgress, onSuccess) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);
        onFinish(response);
    }
    xhr.onprogress = function (e) {
        const percent = Math.round(e.loaded / e.total * 100);
        onProgress(percent)
    }

    xhr.open('POST', 'http://test.com:9527/upload/binary')

    setRequestHeader('Content-Type', 'application/octet-stream');
    setRequestHeader('x-ext', '.' + file.name.split('.').pop());
    xhr.send(file)

    return function () {
        xhr && xhr.abort();
    }
}

function validateFile(file) {
    const sizeLimit = 1 * 1024 * 1024;
    const legalExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const filename = file.name.toLowerCase();
    const ext = filename.split('.').pop();

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return false;
    }

    // 检查文件扩展名
    if (!legalExts.includes(ext)) {
        alert('仅支持 ' + legalExts.join(', ') + ' 格式的图片');
        return false;
    }

    // 检查文件大小
    if (file.size > sizeLimit) {
        alert('文件大小不能超过1MB');
        return false;
    }

    if (file.size === 0) {
        alert('文件不能为空');
        return false;
    }

    return true;
}

doms.cancelBtn.onclick = doms.deleteBtn.onclick = cancel;