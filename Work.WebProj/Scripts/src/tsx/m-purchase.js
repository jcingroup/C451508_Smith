var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Purchase;
(function (Purchase) {
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
            return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(GridCheckDel, {"iKey": this.props.ikey, "chd": this.props.itemData.check_del, "delCheck": this.delCheck})), React.createElement("td", {"className": "text-center"}, React.createElement(GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.purchase_no), React.createElement("td", null, this.props.itemData.sales_name), React.createElement("td", null, moment(this.props.itemData.set_date).format(dt.dateFT)), React.createElement("td", null, this.props.itemData.state));
        };
        GridRow.defaultProps = {};
        return GridRow;
    })(React.Component);
    var ModalSales = (function (_super) {
        __extends(ModalSales, _super);
        function ModalSales() {
            _super.call(this);
            this.close = this.close.bind(this);
            this.queryModal = this.queryModal.bind(this);
            this.setModalKeyword = this.setModalKeyword.bind(this);
            this.selectModal = this.selectModal.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                modalData: [],
                keyword: null
            };
        }
        ModalSales.prototype.close = function () {
            this.props.close();
        };
        ModalSales.prototype.queryModal = function () {
            var _this = this;
            jqGet(gb_approot + 'api/GetAction/GetModalQuerySales', { keyword: this.state.keyword })
                .done(function (data, textStatus, jqXHRdata) {
                var obj = _this.state.modalData;
                obj = data;
                _this.setState({ modalData: obj });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        ModalSales.prototype.setModalKeyword = function (e) {
            var input = e.target;
            var getObj = this.state.keyword;
            getObj = input.value;
            this.setState({ keyword: getObj });
        };
        ModalSales.prototype.selectModal = function (sales_id, e) {
            var _this = this;
            var qObj = this.state.modalData;
            qObj.map(function (item, index, ary) {
                if (item.sales_id == sales_id) {
                    _this.props.updateView(item.sales_id, item.sales_name);
                }
            });
            this.close();
        };
        ModalSales.prototype.render = function () {
            var _this = this;
            var out_html = React.createElement("div", null);
            var ModalQ = ReactBootstrap.Modal;
            if (this.props.isShow) {
                out_html = (React.createElement(ModalQ, {"bsSize": "large", "title": "選擇購買人", "onRequestHide": this.close}, React.createElement("div", {"className": "modal-body"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "購買編號"), " ", React.createElement("input", {"type": "text", "className": "form-control input-sm", "value": this.state.keyword})), React.createElement("div", {"className": "form-group"}, React.createElement("button", {"className": "btn-primary btn-sm", "onClick": this.queryModal}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", {"className": "table-condensed"}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-3"}, "購買編號"), React.createElement("th", {"className": "col-xs-3"}, "會員姓名"), React.createElement("th", {"className": "col-xs-3"}, "日期")), this.state.modalData.map(function (itemData, i) {
                    var out_html = React.createElement("tr", {"key": itemData.sales_id}, React.createElement("td", null, React.createElement("button", {"type": "button", "className": "btn btn-link", "onClick": _this.selectModal.bind(_this, itemData.sales_id)}, itemData.sales_no)), React.createElement("td", null, itemData.sales_name), React.createElement("td", null, itemData.join_date));
                    return out_html;
                }))))));
            }
            return out_html;
        };
        return ModalSales;
    })(React.Component);
    var GirdForm = (function (_super) {
        __extends(GirdForm, _super);
        function GirdForm() {
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
            this.setModalValue = this.setModalValue.bind(this);
            this.updateItems = this.updateItems.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: null,
                detailData: [],
                gridData: { rows: [], page: 1 }, edit_type: 0,
                isShowModalSales: false,
                ModalDataSales: { queryItems: [], search: { keyword: null } }
            };
        }
        GirdForm.prototype.componentDidMount = function () {
            this.queryGridData(1);
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
            if (this.state.edit_type == 1) {
                jqPost(this.props.apiPath, this.state.fieldData)
                    .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        tosMessage(null, '新增完成', 1);
                        _this.updateType(data.purchase_no);
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
                    ids.push('ids=' + this.state.gridData.rows[i].purchase_no);
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
            this.setState({ edit_type: 1, fieldData: { purchase_no: '' }, detailData: [] });
        };
        GirdForm.prototype.updateType = function (no) {
            var _this = this;
            jqGet(this.props.apiPath, { no: no })
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ edit_type: 2, fieldData: data.data });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
            jqGet(this.props.apiPathDetail, { purchase_no: no })
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ detailData: data });
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
        GirdForm.prototype.openModalSales = function () {
            this.setState({ isShowModalSales: true });
        };
        GirdForm.prototype.closeModalSales = function () {
            this.setState({ isShowModalSales: false });
        };
        GirdForm.prototype.updateItems = function (details) {
            var obj = this.state.fieldData;
            var total = 0;
            details.map(function (item, i) {
                item.sub_total = item.price * item.qty;
                total += item.sub_total;
            });
            obj.total = total;
            this.setState({ detailData: details, fieldData: obj });
        };
        GirdForm.prototype.setModalValue = function (sales_id, sales_name) {
            var obj = this.state.fieldData;
            obj.sales_id = sales_id;
            obj.sales_name = sales_name;
            this.setState({ fieldData: obj });
        };
        GirdForm.prototype.render = function () {
            var _this = this;
            var outHtml = null;
            if (this.state.edit_type == 0) {
                var searchData = this.state.searchData;
                outHtml =
                    (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), " ", this.props.menuName)), React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "購買編號"), " ", React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeGDValue.bind(this, 'UserName'), "placeholder": "請輸入關鍵字..."}), " ", React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-2"}, "購買編號"), React.createElement("th", {"className": "col-xs-4"}, "姓名"), React.createElement("th", {"className": "col-xs-3"}, "購買日期"), React.createElement("th", {"className": "col-xs-2"}, "狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                        return React.createElement(GridRow, {"key": i, "ikey": i, "primKey": itemData.purchase_no, "itemData": itemData, "delCheck": _this.delCheck, "updateType": _this.updateType});
                    })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "onQueryGridData": this.queryGridData, "InsertType": this.insertType, "deleteSubmit": this.deleteSubmit}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                var fieldData = this.state.fieldData;
                outHtml = (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), " ", this.props.menuName)), React.createElement("h4", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal clearfix", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-12"}, React.createElement("div", {"className": "alert alert-warning"}, React.createElement("p", null, React.createElement("strong", {"className": "text-danger"}, "紅色標題"), " 為必填欄位。"))), React.createElement("div", {"className": "col-xs-6"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買編號"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'purchase_no'), "value": fieldData.purchase_no, "maxLength": 16, "disabled": this.state.edit_type == 2, "required": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買日期"), React.createElement("div", {"className": "col-xs-10"}, React.createElement(InputDate, {"id": "join_date", "onChange": this.changeFDValue, "field_name": "set_date", "value": fieldData.set_date, "disabled": false, "required": true, "ver": 1})))), React.createElement("div", {"className": "col-xs-6"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "購買人"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'sales_name'), "value": fieldData.sales_name, "maxLength": 32, "required": true}), React.createElement("span", {"className": "input-group-btn"}, React.createElement("a", {"className": "btn", "onClick": this.openModalSales, "disabled": false}, React.createElement("i", {"className": "fa fa-search"})))))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label text-danger"}, "總計金額"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "input-group"}, React.createElement("label", null, fieldData.total))))), React.createElement("div", {"className": "col-xs-12"}, React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "col-xs-10 col-xs-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), " ", React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁"))))), React.createElement(ModalSales, {"close": this.closeModalSales, "isShow": this.state.isShowModalSales, "fieldSalesId": this.state.fieldData.sales_id, "fieldSalesName": this.state.fieldData.sales_name, "updateView": this.setModalValue}), React.createElement(Detail, {"purchase_no": this.state.fieldData.purchase_no, "items": this.state.detailData, "updateItems": this.updateItems})));
            }
            return outHtml;
        };
        GirdForm.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Purchase',
            apiPathDetail: gb_approot + 'api/PurchaseDetail'
        };
        return GirdForm;
    })(React.Component);
    Purchase.GirdForm = GirdForm;
    var Detail = (function (_super) {
        __extends(Detail, _super);
        function Detail() {
            _super.call(this);
            this.updateItem = this.updateItem.bind(this);
            this.newDetail = this.newDetail.bind(this);
            this.newCancel = this.newCancel.bind(this);
            this.submitNew = this.submitNew.bind(this);
            this.submitEdit = this.submitEdit.bind(this);
            this.openModalProduct = this.openModalProduct.bind(this);
            this.closeModalProduct = this.closeModalProduct.bind(this);
            this.render = this.render.bind(this);
            this.state = { isShowModalProduct: false, editKey: 0 };
        }
        Detail.prototype.updateItem = function (index, detail) {
            var obj = this.props.items;
            var item = obj[index];
            item.purchase_detail_id = detail.purchase_detail_id;
            item.product_no = detail.product_no;
            item.product_name = detail.product_name;
            item.price = detail.price;
            item.qty = 0;
            item.sub_total = 0;
            this.props.updateItems(obj);
        };
        Detail.prototype.newDetail = function () {
            var obj = this.props.items;
            obj.push({ edit_type: 1, purchase_no: this.props.purchase_no, product_no: null });
            this.props.updateItems(obj);
        };
        Detail.prototype.newCancel = function (e) {
            var obj = this.props.items;
            obj.splice(-1, 1);
            this.props.updateItems(obj);
        };
        Detail.prototype.editDetail = function (index, e) {
            var obj = this.props.items;
            var item = obj[index];
            this.state.copyItem = clone(item);
            item.edit_type = 2;
            this.props.updateItems(obj);
        };
        Detail.prototype.editCancel = function (index, e) {
            var obj = this.props.items;
            var item = obj[index];
            item.qty = this.state.copyItem.qty;
            item.edit_type = 0;
            this.state.copyItem = null;
            this.props.updateItems(obj);
        };
        Detail.prototype.submitNew = function (e) {
            var _this = this;
            var obj = this.props.items;
            var item = obj.slice(-1)[0];
            jqPost(this.props.apiPath, item)
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    tosMessage(null, '增新完成', 1);
                    item.edit_type = 0;
                    item.purchase_detail_id = data.id;
                    _this.props.updateItems(obj);
                }
                else {
                    alert(data.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        Detail.prototype.submitEdit = function (index) {
            var _this = this;
            var obj = this.props.items;
            var item = obj[index];
            jqPut(this.props.apiPath, item)
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    tosMessage(null, '修改完成', 1);
                    item.edit_type = 0;
                    _this.props.updateItems(obj);
                }
                else {
                    alert(data.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        Detail.prototype.submitDelete = function (index) {
            var _this = this;
            if (!confirm('是否刪除?')) {
                return;
            }
            var obj = this.props.items;
            var item = obj[index];
            jqDelete(this.props.apiPath + '?id=' + item.purchase_detail_id, {})
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    tosMessage(null, '刪除完成', 1);
                    obj.splice(index, 1);
                    _this.props.updateItems(obj);
                }
                else {
                    alert(data.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        Detail.prototype.setValue = function (index, field, e) {
            var obj = this.props.items;
            var item = obj[index];
            var input = e.target;
            item[field] = input.value;
            item.sub_total = item.qty * item.price;
            this.props.updateItems(obj);
        };
        Detail.prototype.openModalProduct = function (index, item, e) {
            this.setState({ isShowModalProduct: true, editKey: index, editItem: item });
        };
        Detail.prototype.closeModalProduct = function () {
            this.setState({ isShowModalProduct: false, editKey: 0 });
        };
        Detail.prototype.render = function () {
            var _this = this;
            return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-12"}, React.createElement("table", {"className": "table-condensed"}, React.createElement("caption", null, "產品購買清單", React.createElement("button", {"type": "button", "onClick": this.newDetail}, "新增")), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1"}, "編輯"), React.createElement("th", {"className": "col-xs-1"}, "項次"), React.createElement("th", {"className": "col-xs-2"}, "品號"), React.createElement("th", {"className": "col-xs-4"}, "品名"), React.createElement("th", {"className": "col-xs-1"}, "單價"), React.createElement("th", {"className": "col-xs-1"}, "購買數量"), React.createElement("th", {"className": "col-xs-2"}, "小計")), this.props.items.map(function (detail, i) {
                var out_detail_html;
                var oper_button;
                if (detail.edit_type == 0) {
                    oper_button = (React.createElement("div", null, React.createElement("button", {"className": "btn btn-link text-danger", "title": "刪除", "onClick": _this.submitDelete.bind(_this, i)}, React.createElement("span", {"className": "glyphicon glyphicon-remove"})), React.createElement("button", {"className": "btn btn-link text-success", "onClick": _this.editDetail.bind(_this, i), "title": "編輯"}, React.createElement("span", {"className": "glyphicon glyphicon-pencil"}))));
                }
                if (detail.edit_type == 1) {
                    oper_button = (React.createElement("div", null, React.createElement("button", {"className": "btn btn-link text-danger", "onClick": _this.newCancel, "title": "放棄"}, React.createElement("span", {"className": "glyphicon glyphicon-share-alt"})), React.createElement("button", {"className": "btn btn-link text-right", "onClick": _this.submitNew}, React.createElement("span", {"className": "glyphicon glyphicon glyphicon-ok", "title": "確認"}))));
                }
                if (detail.edit_type == 2) {
                    oper_button = (React.createElement("div", null, React.createElement("button", {"className": "btn btn-link text-danger", "onClick": _this.editCancel.bind(_this, i), "title": "放棄"}, React.createElement("span", {"className": "glyphicon glyphicon-share-alt"})), React.createElement("button", {"className": "btn btn-link text-right", "onClick": _this.submitEdit.bind(_this, i), "title": "確認"}, React.createElement("span", {"className": "glyphicon glyphicon glyphicon-ok"}))));
                }
                out_detail_html = (React.createElement("tr", null, React.createElement("td", null, oper_button), React.createElement("td", null, detail.item_no), React.createElement("td", null, detail.product_no), React.createElement("td", null, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-10 control-label"}, detail.product_name), React.createElement("div", {"className": "col-xs-2"}, React.createElement("span", {"className": "input-group-btn"}, React.createElement("a", {"className": "btn", "disabled": detail.edit_type == 0 || detail.edit_type == 2, "onClick": _this.openModalProduct.bind(_this, i, detail)}, React.createElement("i", {"className": "fa fa-search"})))))), React.createElement("td", null, React.createElement("input", {"type": "number", "value": detail.price})), React.createElement("td", null, React.createElement("input", {"type": "number", "value": detail.qty, "onChange": _this.setValue.bind(_this, i, 'qty'), "disabled": detail.edit_type == 0})), React.createElement("td", null, React.createElement("input", {"type": "number", "value": detail.sub_total}))));
                return out_detail_html;
            }))))), React.createElement(ModalProduct, {"isShow": this.state.isShowModalProduct, "editIndex": this.state.editKey, "item": this.state.editItem, "close": this.closeModalProduct, "updateItem": this.updateItem})));
        };
        Detail.defaultProps = {
            items: [],
            apiPath: gb_approot + 'api/PurchaseDetail'
        };
        return Detail;
    })(React.Component);
    var ModalProduct = (function (_super) {
        __extends(ModalProduct, _super);
        function ModalProduct() {
            _super.call(this);
            this.close = this.close.bind(this);
            this.queryModal = this.queryModal.bind(this);
            this.setModalKeyword = this.setModalKeyword.bind(this);
            this.selectModal = this.selectModal.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                modalData: [],
                keyword: null
            };
        }
        ModalProduct.prototype.updateItem = function (obj) {
        };
        ModalProduct.prototype.close = function () {
            this.props.close();
        };
        ModalProduct.prototype.queryModal = function () {
            var _this = this;
            jqGet(gb_approot + 'api/GetAction/GetModalQueryProduct', { keyword: this.state.keyword })
                .done(function (data, textStatus, jqXHRdata) {
                var obj = _this.state.modalData;
                obj = data;
                _this.setState({ modalData: obj });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        ModalProduct.prototype.setModalKeyword = function (e) {
            var input = e.target;
            var getObj = this.state.keyword;
            getObj = input.value;
            this.setState({ keyword: getObj });
        };
        ModalProduct.prototype.selectModal = function (product_no, e) {
            var _this = this;
            var qObj = this.state.modalData;
            qObj.map(function (item, index, ary) {
                if (item.product_no == product_no) {
                    var obj = _this.props.item;
                    obj.product_no = item.product_no;
                    obj.product_name = item.product_name;
                    obj.price = item.price;
                    _this.props.updateItem(_this.props.editIndex, obj);
                }
            });
            this.close();
        };
        ModalProduct.prototype.render = function () {
            var _this = this;
            var out_html = React.createElement("div", null);
            var ModalQ = ReactBootstrap.Modal;
            if (this.props.isShow) {
                out_html = (React.createElement(ModalQ, {"bsSize": "large", "title": "選擇產品", "onRequestHide": this.close}, React.createElement("div", {"className": "modal-body"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "購買編號"), " ", React.createElement("input", {"type": "text", "className": "form-control input-sm"})), React.createElement("div", {"className": "form-group"}, React.createElement("button", {"className": "btn-primary btn-sm", "onClick": this.queryModal}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", {"className": "table-condensed"}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-3"}, "品號"), React.createElement("th", {"className": "col-xs-3"}, "品名"), React.createElement("th", {"className": "col-xs-3"}, "單價")), this.state.modalData.map(function (itemData, i) {
                    var out_html = React.createElement("tr", {"key": itemData.product_no}, React.createElement("td", null, React.createElement("button", {"type": "button", "className": "btn btn-link", "onClick": _this.selectModal.bind(_this, itemData.product_no)}, itemData.product_no)), React.createElement("td", null, itemData.product_name), React.createElement("td", null, itemData.price));
                    return out_html;
                }))))));
            }
            return out_html;
        };
        ModalProduct.defaultProps = {
            isShow: false
        };
        return ModalProduct;
    })(React.Component);
})(Purchase || (Purchase = {}));
var dom = document.getElementById('page_content');
React.render(React.createElement(Purchase.GirdForm, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
