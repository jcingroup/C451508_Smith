/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.language = 'zh';
    // config.uiColor = '#AADC6E';
    config.contentsCss = ['../Content/css/editor.css'];
    config.toolbar = [
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Italic", "Underline", "-", "JustifyLeft", "JustifyCenter", "JustifyRight"]
        },
        {
            name: "paragraph",
            items: ["NumberedList", "BulletedList", "-"]
        }, {
            name: "tools",
            items: ["Maximize", "-"]
        }, {
            name: "links",
            items: ["Link", "Unlink"]
        }, {
            name: 'insert',
            items: ['Image', 'Table', 'Smiley', 'Iframe']
        }, {
            name: "colors",
            items: ["TextColor", "BGColor"]
        }, {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "Undo", "Redo", "-", "Source"]
        }];

    config.filebrowserBrowseUrl = "../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;
};
