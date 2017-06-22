/**
 * Created by Administrator on 2017/6/19 0019.
 */
/*
 *�ƶ���ͼƬѹ���ϴ����ܺ�̨
 */
"use strict";

var fs = require('fs');
var router = require("../router");
//var FormParser = require("./formParser");
var formidable = require('formidable');
var path = require('path');

var fileSaveDir = path.join(STATIC_PATH, 'upload');

router.setMap({
    "uindex_2": path.join(__dirname, "./index_2.html"),
    "cupload": cupload
});

function cupload(req, res) {
    if (!fs.existsSync(fileSaveDir)) {
        fs.mkdirSync(fileSaveDir)
    }

    var form = new formidable.IncomingForm();
    var responseData = [];
    form.uploadDir = fileSaveDir;
    form.type = true;
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files){
        if(!err) {
            Object.keys(files).forEach(function(key){
                var file = files[key];
                var filename = path.basename(file.path);

                //ÿ��ͼƬ����һ���ӱ���ʱ��
                setTimeout(function() {
                    if (!fs.existsSync(file.path)) return;

                    console.log("\x1B[33mɾ���ļ�" + filename + "\x1B[0m");
                    fs.unlinkSync(file.path);
                }, 60 * 1000);

                // ������Ӧ������
                responseData.push({
                    type: file.type,
                    name: filename,
                    path: '/public/upload/' + filename,
                    size: file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB"
                });
            });
        } else {
            console.warn(err);
        }

        res.writeHead(200);
        res.end(JSON.stringify(responseData));
    });
}