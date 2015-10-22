var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GridRowPurchase = (function (_super) {
    __extends(GridRowPurchase, _super);
    function GridRowPurchase() {
        _super.call(this);
        this.delCheck = this.delCheck.bind(this);
        this.modify = this.modify.bind(this);
    }
    GridRowPurchase.prototype.delCheck = function (i, chd) {
        this.props.delCheck(i, chd);
    };
    GridRowPurchase.prototype.modify = function () {
        this.props.updateType(this.props.primKey);
    };
    GridRowPurchase.prototype.render = function () {
        return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(GridCheckDel, {"iKey": this.props.ikey, "chd": this.props.itemData.check_del, "delCheck": this.delCheck})), React.createElement("td", {"className": "text-center"}, React.createElement(GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.purchase_no), React.createElement("td", null, this.props.itemData.sales_name), React.createElement("td", null, moment(this.props.itemData.set_date).format(dt.dateFT)), React.createElement("td", null, this.props.itemData.state));
    };
    GridRowPurchase.defaultProps = {};
    return GridRowPurchase;
})(React.Component);
var GirdFormPurchase = (function (_super) {
    __extends(GirdFormPurchase, _super);
    function GirdFormPurchase() {
        _super.call(this);
        this.updateType = this.updateType.bind(this);
        this.noneType = this.noneType.bind(this);
        this.queryGridData = this.queryGridData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteSubmit = this.deleteSubmit.bind(this);
        this.delCheck = this.delCheck.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.insertType = this.insertType.bind(this);
        this.changeGDValue = this.changeGDValue.bind(this);
        this.changeFDValue = this.changeFDValue.bind(this);
        this.setInputValue = this.setInputValue.bind(this);
        this.closeModalSales = this.closeModalSales.bind(this);
        this.openModalSales = this.openModalSales.bind(this);
        this.queryModalSales = this.queryModalSales.bind(this);
        this.setModalSalesKeyword = this.setModalSalesKeyword.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0,
            isShowModalSales: false,
            ModalDataSales: { queryItems: [], search: { keyword: null } }
        };
    }
    GirdFormPurchase.prototype.componentDidMount = function () {
        this.queryGridData(1);
    };
    GirdFormPurchase.prototype.gridData = function (page) {
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
        return jqGet(this.props.apiPathName, parms);
    };
    GirdFormPurchase.prototype.queryGridData = function (page) {
        this.gridData(page)
            .done(function (data, textStatus, jqXHRdata) {
            this.setState({ gridData: data });
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            showAjaxError(errorThrown);
        });
    };
    GirdFormPurchase.prototype.handleSubmit = function (e) {
        var _this = this;
        e.preventDefault();
        if (this.state.edit_type == 1) {
            jqPost(this.props.apiPathName, this.state.fieldData)
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    tosMessage(null, '新增完成', 1);
                    _this.updateType(data.product_id);
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
            jqPut(this.props.apiPathName, this.state.fieldData)
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
    GirdFormPurchase.prototype.deleteSubmit = function () {
        if (!confirm('確定是否刪除?')) {
            return;
        }
        var ids = [];
        for (var i in this.state.gridData.rows) {
            if (this.state.gridData.rows[i].check_del) {
                ids.push('ids=' + this.state.gridData.rows[i].purchase_id);
            }
        }
        if (ids.length == 0) {
            tosMessage(null, '未選擇刪除項', 2);
            return;
        }
        jqDelete(this.props.apiPathName + '?' + ids.join('&'), {})
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
    GirdFormPurchase.prototype.handleSearch = function (e) {
        e.preventDefault();
        this.queryGridData(0);
        return;
    };
    GirdFormPurchase.prototype.delCheck = function (i, chd) {
        var newState = this.state;
        this.state.gridData.rows[i].check_del = !chd;
        this.setState(newState);
    };
    GirdFormPurchase.prototype.checkAll = function () {
        var newState = this.state;
        newState.checkAll = !newState.checkAll;
        for (var prop in this.state.gridData.rows) {
            this.state.gridData.rows[prop].check_del = newState.checkAll;
        }
        this.setState(newState);
    };
    GirdFormPurchase.prototype.insertType = function () {
        this.setState({ edit_type: 1, fieldData: { purchase_id: 0 } });
    };
    GirdFormPurchase.prototype.updateType = function (id) {
        var _this = this;
        jqGet(this.props.apiPathName, { id: id })
            .done(function (data, textStatus, jqXHRdata) {
            _this.setState({ edit_type: 2, fieldData: data.data });
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            showAjaxError(errorThrown);
        });
    };
    GirdFormPurchase.prototype.noneType = function () {
        this.gridData(0)
            .done(function (data, textStatus, jqXHRdata) {
            this.setState({ edit_type: 0, gridData: data });
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            showAjaxError(errorThrown);
        });
    };
    GirdFormPurchase.prototype.changeFDValue = function (name, e) {
        this.setInputValue(this.props.fdName, name, e);
    };
    GirdFormPurchase.prototype.changeGDValue = function (name, e) {
        this.setInputValue(this.props.gdName, name, e);
    };
    GirdFormPurchase.prototype.setInputValue = function (collentName, name, e) {
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
    GirdFormPurchase.prototype.openModalSales = function () {
        this.setState({ isShowModalSales: true });
    };
    GirdFormPurchase.prototype.closeModalSales = function () {
        this.setState({ isShowModalSales: false });
    };
    GirdFormPurchase.prototype.queryModalSales = function () {
        var _this = this;
        jqGet(gb_approot + 'api/GetAction/GetModalQuerySales', { keyword: this.state.ModalDataSales.search.keyword })
            .done(function (data, textStatus, jqXHRdata) {
            var getObj = _this.state.ModalDataSales;
            getObj.queryItems = data;
            _this.setState({ ModalDataSales: getObj });
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            showAjaxError(errorThrown);
        });
    };
    GirdFormPurchase.prototype.setModalSalesKeyword = function (e) {
        var input = e.target;
        var getObj = this.state.ModalDataSales;
        getObj.search.keyword = input.value;
        this.setState({ ModalDataSales: getObj });
    };
    GirdFormPurchase.prototype.selectModalSales = function (sales_id, e) {
        var _this = this;
        var getQueryItems = this.state.ModalDataSales.queryItems;
        getQueryItems.map(function (value, index, ary) {
            if (value.sales_id == sales_id) {
                var getFieldObj = _this.state.fieldData;
                _this.setState({ fieldData: getFieldObj, isShowModalSales: false });
            }
        });
    };
    GirdFormPurchase.prototype.render = function () {
        var _this = this;
        var outHtml = null;
        if (this.state.edit_type == 0) {
            var searchData = this.state.searchData;
            outHtml =
                (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), " ", this.props.menuName)), React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "購買編號"), " ", React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeGDValue.bind(this, 'UserName'), "placeholder": "請輸入關鍵字..."}), " ", React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-3"}, "購買編號"), React.createElement("th", {"className": "col-xs-3"}, "姓名"), React.createElement("th", {"className": "col-xs-3"}, "購買日期"), React.createElement("th", {"className": "col-xs-2"}, "狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                    return React.createElement(GridRowPurchase, {"key": i, "ikey": i, "primKey": itemData.purchase_id, "itemData": itemData, "delCheck": _this.delCheck, "updateType": _this.updateType});
                })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "onQueryGridData": this.queryGridData, "InsertType": this.insertType, "deleteSubmit": this.deleteSubmit}))));
        }
        else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
            var ModalSales = ReactBootstrap.Modal;
            var fieldData = this.state.fieldData;
            var out_ModalSales = null;
            if (this.state.isShowModalSales) {
                out_ModalSales = (React.createElement(ModalSales, {"bsSize": "large", "title": "選擇推薦人", "onRequestHide": this.closeModalSales}, React.createElement("div", {"className": "modal-body"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "購買編號"), " ", React.createElement("input", {"type": "text", "className": "form-control input-sm", "onChange": this.setModalSalesKeyword, "value": this.state.ModalDataSales.search.keyword})), React.createElement("div", {"className": "form-group"}, React.createElement("button", {"className": "btn-primary btn-sm", "onClick": this.queryModalSales}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", {"className": "table-condensed"}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-3"}, "購買編號"), React.createElement("th", {"className": "col-xs-3"}, "會員姓名"), React.createElement("th", {"className": "col-xs-3"}, "日期")), this.state.ModalDataSales.queryItems.map(function (itemData, i) {
                    var out_html = React.createElement("tr", {"key": itemData.sales_id}, React.createElement("td", null, React.createElement("button", {"type": "button", "className": "btn btn-link", "onClick": _this.selectModalSales.bind(_this, itemData.sales_id)}, itemData.sales_no)), React.createElement("td", null, itemData.sales_name));
                    return out_html;
                }))))));
            }
            outHtml = (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), " ", this.props.menuName)), React.createElement("h4", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-12"}, React.createElement("div", {"className": "alert alert-warning"}, React.createElement("p", null, React.createElement("strong", {"className": "text-danger"}, "紅色標題"), " 為必填欄位。"))), React.createElement("div", {"className": "col-xs-6"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買編號"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'purchase_no'), "value": fieldData.purchase_no, "maxLength": 16, "disabled": this.state.edit_type == 2, "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買日期"), React.createElement("div", {"className": "col-xs-10"}, React.createElement(InputDate, {"id": "join_date", "onChange": this.changeFDValue, "field_name": "set_date", "value": fieldData.set_date, "disabled": false, "required": true, "ver": 1})))), React.createElement("div", {"className": "col-xs-6"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買人"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'sales_name'), "value": fieldData.sales_name, "maxLength": 32, "required": true}), React.createElement("span", {"className": "input-group-btn"}, React.createElement("a", {"className": "btn", "onClick": this.openModalSales, "disabled": false}, React.createElement("i", {"className": "fa fa-search"}))))))), React.createElement("div", {"className": "col-xs-12"}, React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "col-xs-10 col-xs-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), " ", React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁"))))), out_ModalSales));
        }
        return outHtml;
    };
    GirdFormPurchase.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPathName: gb_approot + 'api/Purchase'
    };
    return GirdFormPurchase;
})(React.Component);
var dom = document.getElementById('page_content');
React.render(React.createElement(GirdFormPurchase, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
