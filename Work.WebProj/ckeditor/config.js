/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    //config.skin = 'bootstrapck';
    config.height = 500;
    config.language = 'zh';
    config.extraPlugins = 'youtube';
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

    config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;

    //不要轉換htmltag
    config.allowedContent = true;
    config.fontSize_sizes = '12px/12px;13/13px;16/16px;18/18px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';
};
