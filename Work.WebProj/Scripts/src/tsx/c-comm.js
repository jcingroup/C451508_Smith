var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
;
var GridButtonModify = (function (_super) {
    __extends(GridButtonModify, _super);
    function GridButtonModify(props) {
        _super.call(this, props);
        this.onClick = this.onClick.bind(this);
    }
    GridButtonModify.prototype.onClick = function () {
        this.props.modify();
    };
    GridButtonModify.prototype.render = function () {
        return React.createElement("button", {"type": "button", "className": "btn-link btn-lg", "onClick": this.onClick}, React.createElement("i", {"className": "fa-pencil"}));
    };
    return GridButtonModify;
})(React.Component);
var GridCheckDel = (function (_super) {
    __extends(GridCheckDel, _super);
    function GridCheckDel() {
        _super.call(this);
        this.onChange = this.onChange.bind(this);
    }
    GridCheckDel.prototype.onChange = function (e) {
        this.props.delCheck(this.props.iKey, this.props.chd);
    };
    GridCheckDel.prototype.render = function () {
        return React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.props.chd, "onChange": this.onChange}), React.createElement("i", {"className": "fa-check"}));
    };
    return GridCheckDel;
})(React.Component);
var InputDate = (function (_super) {
    __extends(InputDate, _super);
    function InputDate(props) {
        _super.call(this, props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onChange = this.onChange.bind(this);
        this.render = this.render.bind(this);
    }
    InputDate.prototype.componentDidMount = function () {
        $('#' + this.props.id).datetimepicker({
            format: 'YYYY-MM-DD',
            icons: {
                previous: "fa-angle-left",
                next: "fa-angle-right"
            }
        }).on('dp.change', function (e) {
            this.props.onChange(this.props.field_name, e);
        }.bind(this));
    };
    InputDate.prototype.onChange = function (e) {
        console.log('onChange', 'datetimepicker1');
        this.props.onChange(this.props.field_name, e);
        console.log('onChange', 'datetimepicker2');
    };
    InputDate.prototype.render = function () {
        var out_html = null;
        if (this.props.ver == 1) {
            out_html = (React.createElement("div", null, React.createElement("input", {"type": "date", "className": "form-control datetimepicker", "id": this.props.id, "name": this.props.field_name, "value": this.props.value != undefined ? moment(this.props.value).format('YYYY-MM-DD') : '', "onChange": this.onChange, "required": this.props.required, "disabled": this.props.disabled}), React.createElement("i", {"className": "fa-calendar form-control-feedback"})));
        }
        else if (this.props.ver == 2) {
            out_html = (React.createElement("div", null, React.createElement("input", {"type": "date", "className": "form-control input-sm datetimepicker", "id": this.props.id, "name": this.props.field_name, "value": this.props.value != undefined ? moment(this.props.value).format(dt.dateFT) : '', "onChange": this.onChange, "required": this.props.required, "disabled": this.props.disabled}), React.createElement("i", {"className": "fa-calendar form-control-feedback"})));
        }
        return out_html;
    };
    InputDate.defaultProps = {
        id: null,
        value: null,
        onChange: null,
        field_name: null,
        required: false,
        disabled: false,
        ver: 1
    };
    return InputDate;
})(React.Component);
var GridNavPage = (function (_super) {
    __extends(GridNavPage, _super);
    function GridNavPage(props) {
        _super.call(this, props);
        this.nextPage = this.nextPage.bind(this);
        this.prvePage = this.prvePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }
    GridNavPage.prototype.firstPage = function () {
        this.props.onQueryGridData(1);
    };
    GridNavPage.prototype.lastPage = function () {
        this.props.onQueryGridData(this.props.totalPage);
    };
    GridNavPage.prototype.nextPage = function () {
        if (this.props.nowPage < this.props.totalPage) {
            this.props.onQueryGridData(this.props.nowPage + 1);
        }
    };
    GridNavPage.prototype.prvePage = function () {
        if (this.props.nowPage > 1) {
            this.props.onQueryGridData(this.props.nowPage - 1);
        }
    };
    GridNavPage.prototype.jumpPage = function () {
    };
    GridNavPage.prototype.render = function () {
        var setAddButton = null, setDeleteButton = null;
        if (this.props.showAdd) {
            setAddButton = React.createElement("button", {"className": "btn-link text-success", "type": "button", "onClick": this.props.InsertType}, React.createElement("i", {"className": "fa-plus-circle"}), " 新增");
        }
        if (this.props.showDelete) {
            setDeleteButton = React.createElement("button", {"className": "btn-link text-danger", "type": "button", "onClick": this.props.deleteSubmit}, React.createElement("i", {"className": "fa-trash-o"}), " 刪除");
        }
        var oper = null;
        oper = (React.createElement("div", {"className": "table-footer"}, React.createElement("div", {"className": "pull-left"}, setAddButton, setDeleteButton), React.createElement("small", {"className": "pull-right"}, "第", this.props.startCount, "-", this.props.endCount, "筆，共", this.props.recordCount, "筆"), React.createElement("ul", {"className": "pager"}, React.createElement("li", null, React.createElement("a", {"href": "#", "title": "移至第一頁", "tabIndex": -1, "onClick": this.firstPage}, React.createElement("i", {"className": "fa-angle-double-left"}))), " ", React.createElement("li", null, React.createElement("a", {"href": "#", "title": "上一頁", "tabIndex": -1, "onClick": this.prvePage}, React.createElement("i", {"className": "fa-angle-left"}))), " ", React.createElement("li", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "第"), ' ', React.createElement("input", {"className": "form-control text-center", "type": "number", "min": "1", "tabIndex": -1, "value": this.props.nowPage.toString(), "onChange": this.jumpPage}), ' ', React.createElement("label", null, "頁，共", this.props.totalPage, "頁"))), " ", React.createElement("li", null, React.createElement("a", {"href": "#", "title": "@Resources.Res.NextPage", "tabIndex": -1, "onClick": this.nextPage}, React.createElement("i", {"className": "fa-angle-right"}))), " ", React.createElement("li", null, React.createElement("a", {"href": "#", "title": "移至最後一頁", "tabIndex": -1, "onClick": this.lastPage}, React.createElement("i", {"className": "fa-angle-double-right"}))))));
        return oper;
    };
    GridNavPage.defaultProps = {
        showAdd: true,
        showDelete: true
    };
    return GridNavPage;
})(React.Component);
