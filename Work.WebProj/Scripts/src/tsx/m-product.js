var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Product;
(function (Product) {
    var GridRow = (function (_super) {
        __extends(GridRow, _super);
        function GridRow() {
            _super.call(this);
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        GridRow.prototype.delCheck = function (i, chd) {
            this.props.delCheck(i, chd);
        };
        GridRow.prototype.modify = function () {
            this.props.updateType(this.props.primKey);
        };
        GridRow.prototype.render = function () {
            return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(GridCheckDel, {"iKey": this.props.ikey, "chd": this.props.itemData.check_del, "delCheck": this.delCheck})), React.createElement("td", {"className": "text-center"}, React.createElement(GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.category_name), React.createElement("td", null, this.props.itemData.model_type), React.createElement("td", null, this.props.itemData.product_name), React.createElement("td", null, this.props.itemData.i_Hide ? React.createElement("span", {"className": "label label-default"}, "隱藏") : React.createElement("span", {"className": "label label-primary"}, "顯示")));
        };
        GridRow.defaultProps = {};
        return GridRow;
    })(React.Component);
    var GirdForm = (function (_super) {
        __extends(GirdForm, _super);
        function GirdForm() {
            _super.call(this);
            this.getInitData = this.getInitData.bind(this);
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.insertType = this.insertType.bind(this);
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, category_option: [], searchData: {} };
        }
        GirdForm.prototype.componentDidMount = function () {
            this.queryGridData(1);
            this.getInitData();
        };
        GirdForm.prototype.componentDidUpdate = function (prevProps, prevState) {
            if (prevState.edit_type == 0 && this.state.edit_type == 1) {
                CKEDITOR.replace('editor1', {});
            }
        };
        GirdForm.prototype.getInitData = function () {
            var _this = this;
            jqGet(this.props.InitPath, {})
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({
                    category_option: data
                });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.gridData = function (page) {
            var parms = {
                page: 0
            };
            if (page == 0) {
                parms.page = this.state.gridData.page;
            }
            else {
                parms.page = page;
            }
            $.extend(parms, this.state.searchData);
            return jqGet(this.props.apiPath, parms);
        };
        GirdForm.prototype.queryGridData = function (page) {
            this.gridData(page)
                .done(function (data, textStatus, jqXHRdata) {
                this.setState({ gridData: data });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.handleSubmit = function (e) {
            var _this = this;
            e.preventDefault();
            this.state.fieldData.product_content = CKEDITOR.instances.editor1.getData();
            if (this.state.edit_type == 1) {
                jqPost(this.props.apiPath, this.state.fieldData)
                    .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        tosMessage(null, '新增完成', 1);
                        _this.updateType(data.id);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
            }
            else if (this.state.edit_type == 2) {
                jqPut(this.props.apiPath, this.state.fieldData)
                    .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        tosMessage(null, '修改完成', 1);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
            }
            ;
            return;
        };
        GirdForm.prototype.deleteSubmit = function () {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].product_id);
                }
            }
            if (ids.length == 0) {
                tosMessage(null, '未選擇刪除項', 2);
                return;
            }
            jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    tosMessage(null, '刪除完成', 1);
                    this.queryGridData(0);
                }
                else {
                    alert(data.message);
                }
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.handleSearch = function (e) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        };
        GirdForm.prototype.delCheck = function (i, chd) {
            var newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        };
        GirdForm.prototype.checkAll = function () {
            var newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        };
        GirdForm.prototype.insertType = function () {
            this.setState({ edit_type: 1, fieldData: { category_id: this.state.category_option[0].product_category_id, price: 0, i_Hide: false } });
        };
        GirdForm.prototype.updateType = function (id) {
            var _this = this;
            jqGet(this.props.apiPath, { id: id })
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ edit_type: 2, fieldData: data.data });
                CKEDITOR.replace('editor1', {});
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.noneType = function () {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                this.setState({ edit_type: 0, gridData: data });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.changeFDValue = function (name, e) {
            this.setInputValue(this.props.fdName, name, e);
        };
        GirdForm.prototype.changeGDValue = function (name, e) {
            this.setInputValue(this.props.gdName, name, e);
        };
        GirdForm.prototype.setInputValue = function (collentName, name, e) {
            var input = e.target;
            var obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            }
            else if (input.value == 'false') {
                obj[name] = false;
            }
            else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        };
        GirdForm.prototype.render = function () {
            var _this = this;
            var outHtml = null;
            if (this.state.edit_type == 0) {
                var searchData = this.state.searchData;
                outHtml =
                    (React.createElement("div", null, React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "產品名稱"), " ", React.createElement("input", {"type": "text", "className": "form-control", "value": searchData.name, "onChange": this.changeGDValue.bind(this, 'name'), "placeholder": "請輸入關鍵字..."}), " ", React.createElement("label", null, "產品分類"), " ", React.createElement("select", {"className": "form-control", "value": searchData.product_category_id, "onChange": this.changeGDValue.bind(this, 'product_category_id')}, React.createElement("option", {"value": ""}, "全部分類"), this.state.category_option.map(function (itemData, i) {
                        return React.createElement("option", {"key": itemData.product_category_id, "value": itemData.product_category_id.toString()}, itemData.category_name);
                    })), " ", React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-2"}, "產品分類"), React.createElement("th", {"className": "col-xs-2"}, "產品型號"), React.createElement("th", {"className": "col-xs-4"}, "產品名稱"), React.createElement("th", {"className": "col-xs-1"}, "狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                        return React.createElement(GridRow, {"key": i, "ikey": i, "primKey": itemData.product_id, "itemData": itemData, "delCheck": _this.delCheck, "updateType": _this.updateType});
                    })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "onQueryGridData": this.queryGridData, "InsertType": this.insertType, "deleteSubmit": this.deleteSubmit}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                var fieldData = this.state.fieldData;
                outHtml = (React.createElement("div", null, React.createElement("h3", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-12"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "代表圖"), React.createElement("div", {"className": "col-xs-4"}, React.createElement(MasterImageUpload, {"FileKind": "Photo1", "MainId": fieldData.product_id, "ParentEditType": this.state.edit_type, "url_upload": gb_approot + 'Active/ProductData/axFUpload', "url_list": gb_approot + 'Active/ProductData/axFList', "url_delete": gb_approot + 'Active/ProductData/axFDelete', "url_sort": gb_approot + 'Active/ProductData/axFSort'})), React.createElement("small", {"className": "help-inline col-xs-4 text-danger"}, "限 1 張圖片，檔案大小不可超過4.8MB")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "產品分類"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("select", {"className": "form-control", "value": fieldData.category_id, "onChange": this.changeFDValue.bind(this, 'category_id')}, this.state.category_option.map(function (itemData, i) {
                    return React.createElement("option", {"key": itemData.product_category_id, "value": itemData.product_category_id.toString()}, itemData.category_name);
                }))), React.createElement("small", {"className": "help-inline col-xs-6"}, React.createElement("span", {"className": "text-danger"}, "(必填) "))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "產品名稱"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'product_name'), "value": fieldData.product_name, "maxLength": 64, "required": true})), React.createElement("small", {"className": "help-inline col-xs-6"}, "最多64個字", React.createElement("span", {"className": "text-danger"}, "(必填) "))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "產品型號"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'model_type'), "value": fieldData.model_type, "maxLength": 16, "required": true})), React.createElement("small", {"className": "help-inline col-xs-6"}, "最多16個字", React.createElement("span", {"className": "text-danger"}, "(必填) "))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "排序"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "number", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'sort'), "value": fieldData.sort})), React.createElement("small", {"className": "col-xs-2 help-inline"}, "數字越大越前面")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "狀態"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "i_Hide", "value": true, "checked": fieldData.i_Hide === true, "onChange": this.changeFDValue.bind(this, 'i_Hide')}), React.createElement("span", null, "隱藏"))), React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "i_Hide", "value": false, "checked": fieldData.i_Hide === false, "onChange": this.changeFDValue.bind(this, 'i_Hide')}), React.createElement("span", null, "顯示"))))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "產品內容"), React.createElement("div", {"className": "col-xs-8"}, React.createElement("textarea", {"cols": 30, "rows": 3, "className": "form-control", "id": "editor1", "value": fieldData.product_content, "onChange": this.changeFDValue.bind(this, 'product_content'), "maxLength": 256}))), React.createElement("div", {"className": "form-action text-right"}, React.createElement("div", {"className": "col-xs-5"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), " ", React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁")))))));
            }
            return outHtml;
        };
        GirdForm.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Product',
            InitPath: gb_approot + 'Active/ProductData/aj_Init'
        };
        return GirdForm;
    })(React.Component);
    Product.GirdForm = GirdForm;
})(Product || (Product = {}));
var dom = document.getElementById('page_content');
React.render(React.createElement(Product.GirdForm, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
