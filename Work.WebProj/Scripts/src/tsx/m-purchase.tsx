interface RowPurchase {
    check_del: boolean,
    purchase_id: number;
    purchase_no: string;
    set_date: Date;
    state: number;
    sales_id: number;
    sales_name: string;
}

class GridRowPurchase extends React.Component<BaseDefine.GridRowPropsBase<RowPurchase>, BaseDefine.GridRowStateBase> {
    constructor() {
        super();
        this.delCheck = this.delCheck.bind(this);
        this.modify = this.modify.bind(this);
    }
    static defaultProps = {
    }
    delCheck(i, chd) {
        this.props.delCheck(i, chd);
    }
    modify() {
        this.props.updateType(this.props.primKey)
    }

    render() {
        return <tr>
                    <td className="text-center">
                         <GridCheckDel iKey={this.props.ikey}
                             chd={this.props.itemData.check_del}
                             delCheck={this.delCheck} />
                        </td>
                    <td className="text-center">
                        <GridButtonModify modify={this.modify}/>
                        </td>
                    <td>{this.props.itemData.purchase_no}</td>
                    <td>{this.props.itemData.sales_name}</td>
                    <td>{moment(this.props.itemData.set_date).format(dt.dateFT) }</td>
                    <td>{this.props.itemData.state}</td>
            </tr>;
    }
}

interface PurchaseState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
    isShowModalSales?: boolean;
    ModalDataSales?: {
        search?: { keyword: string }
        queryItems?: Array<{ sales_id: number, sales_no: string, sales_name: string }>;
    }
}
interface PurchaseResult extends IResultBase {
    sales_id: number
}

class GirdFormPurchase extends React.Component<BaseDefine.GridFormPropsBase, PurchaseState<RowPurchase, server.Purchase>>{

    constructor() {

        super();
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
        }

    }
    static defaultProps: BaseDefine.GridFormPropsBase = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPathName: gb_approot + 'api/Purchase'
    }
    componentDidMount() {
        this.queryGridData(1);
    }

    gridData(page: number) {

        var parms = {
            page: 0
        };

        if (page == 0) {
            parms.page = this.state.gridData.page;
        } else {
            parms.page = page;
        }

        $.extend(parms, this.state.searchData);

        return jqGet(this.props.apiPathName, parms);
    }
    queryGridData(page: number) {
        this.gridData(page)
            .done(function (data, textStatus, jqXHRdata) {
                this.setState({ gridData: data });
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
    }
    handleSubmit(e: React.FormEvent) {

        e.preventDefault();
        if (this.state.edit_type == 1) {
            jqPost(this.props.apiPathName, this.state.fieldData)
                .done((data: ProductResult, textStatus, jqXHRdata) => {
                    if (data.result) {
                        tosMessage(null, '新增完成', 1);
                        this.updateType(data.product_id);
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }
        else if (this.state.edit_type == 2) {
            jqPut(this.props.apiPathName, this.state.fieldData)
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        tosMessage(null, '修改完成', 1);
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        };
        return;
    }
    deleteSubmit() {

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
                } else {
                    alert(data.message);
                }
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
    }
    handleSearch(e: React.FormEvent) {
        e.preventDefault();
        this.queryGridData(0);
        return;
    }
    delCheck(i: number, chd: boolean) {
        let newState = this.state;
        this.state.gridData.rows[i].check_del = !chd;
        this.setState(newState);
    }
    checkAll() {

        let newState = this.state;
        newState.checkAll = !newState.checkAll;
        for (var prop in this.state.gridData.rows) {
            this.state.gridData.rows[prop].check_del = newState.checkAll;
        }
        this.setState(newState);
    }
    insertType() {
        this.setState({ edit_type: 1, fieldData: { purchase_id: 0 } });
    }
    updateType(id: number | string) {

        jqGet(this.props.apiPathName, { id: id })
            .done((data, textStatus, jqXHRdata) => {
                this.setState({ edit_type: 2, fieldData: data.data });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                showAjaxError(errorThrown);
            });
    }
    noneType() {
        this.gridData(0)
            .done(function (data, textStatus, jqXHRdata) {
                this.setState({ edit_type: 0, gridData: data });
            }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
    }

    changeFDValue(name: string, e: React.SyntheticEvent) {
        this.setInputValue(this.props.fdName, name, e);
    }
    changeGDValue(name: string, e: React.SyntheticEvent) {
        this.setInputValue(this.props.gdName, name, e);
    }
    setInputValue(collentName: string, name: string, e: React.SyntheticEvent) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let obj = this.state[collentName];

        if (input.value == 'true') {
            obj[name] = true;
        } else if (input.value == 'false') {
            obj[name] = false;
        } else {
            obj[name] = input.value;
        }
        this.setState({ fieldData: obj });
    }

    openModalSales() {
        this.setState({ isShowModalSales: true });
    }
    closeModalSales() {
        this.setState({ isShowModalSales: false });
    }
    queryModalSales() {
        jqGet(gb_approot + 'api/GetAction/GetModalQuerySales', { keyword: this.state.ModalDataSales.search.keyword })
            .done((data, textStatus, jqXHRdata) => {

                var getObj = this.state.ModalDataSales;
                getObj.queryItems = data;
                this.setState({ ModalDataSales: getObj });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                showAjaxError(errorThrown);
            });
    }
    setModalSalesKeyword(e: React.SyntheticEvent) {

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let getObj = this.state.ModalDataSales;
        getObj.search.keyword = input.value;
        this.setState({ ModalDataSales: getObj });
    }
    selectModalSales(sales_id: number, e: React.SyntheticEvent) {

        let getQueryItems = this.state.ModalDataSales.queryItems;

        getQueryItems.map((value, index, ary) => {

            if (value.sales_id == sales_id) {
                let getFieldObj = this.state.fieldData;
                //getFieldObj.recommend_id = value.sales_id;
                //getFieldObj.recommend_name = value.sales_name;
                this.setState({ fieldData: getFieldObj, isShowModalSales: false });
            }
        });
    }

    render() {
        var outHtml: JSX.Element = null;

        if (this.state.edit_type == 0) {
            var searchData = this.state.searchData;
            outHtml =
            (
                <div>
    <ul className="breadcrumb">
        <li><i className="fa-list-alt"></i> {this.props.menuName}</li>
        </ul>
    <h3 className="title">
        {this.props.caption}
        </h3>
    <form onSubmit={this.handleSearch}>
        <div className="table-responsive">
            <div className="table-header">
                <div className="table-filter">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>購買編號</label> { }
                            <input type="text" className="form-control"
                                onChange={this.changeGDValue.bind(this, 'UserName') }
                                placeholder="請輸入關鍵字..." /> { }
                            <button className="btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                            </div>
                        </div>
                    </div>
                </div>
            <table>
                <thead>
                    <tr>
                        <th className="col-xs-1 text-center">
                            <label className="cbox">
                                <input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
                                <i className="fa-check"></i>
                                </label>
                            </th>
                        <th className="col-xs-1 text-center">修改</th>
                        <th className="col-xs-3">購買編號</th>
                        <th className="col-xs-3">姓名</th>
                        <th className="col-xs-3">購買日期</th>
                        <th className="col-xs-2">狀態</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRowPurchase key={i}
                                ikey={i}
                                primKey={itemData.purchase_id}
                                itemData={itemData}
                                delCheck={this.delCheck}
                                updateType={this.updateType} />
                    )
                    }
                    </tbody>
                </table>
            </div>
        <GridNavPage startCount={this.state.gridData.startcount}
            endCount={this.state.gridData.endcount}
            recordCount={this.state.gridData.records}
            totalPage={this.state.gridData.total}
            nowPage={this.state.gridData.page}
            onQueryGridData={this.queryGridData}
            InsertType={this.insertType}
            deleteSubmit={this.deleteSubmit} />
        </form>
                    </div>
            );
        }
        else if (this.state.edit_type == 1 || this.state.edit_type == 2) {

            let ModalSales = ReactBootstrap.Modal;
            let fieldData = this.state.fieldData;
            let out_ModalSales: JSX.Element = null;

            if (this.state.isShowModalSales) {
                out_ModalSales = (
                    <ModalSales bsSize="large" title="選擇推薦人" onRequestHide={this.closeModalSales}>
    <div className="modal-body">
        <div className="table-header">
            <div className="table-filter">
                <div className="form-inline">
                    <div className="form-group">
                        <label>購買編號</label> { }
                        <input type="text" className="form-control input-sm"
                            onChange={this.setModalSalesKeyword}
                            value={this.state.ModalDataSales.search.keyword}
                            />
                        </div>

                    <div className="form-group">
                        <button className="btn-primary btn-sm" onClick={this.queryModalSales}><i className="fa-search"></i> 搜尋</button>
                        </div>
                    </div>
                </div>
            </div>
        <table className="table-condensed">
            <tbody>
                <tr>
                    <th className="col-xs-3">購買編號</th>
                    <th className="col-xs-3">會員姓名</th>
                    <th className="col-xs-3">日期</th>
                    </tr>
                {
                this.state.ModalDataSales.queryItems.map((itemData, i) => {

                    var out_html =
                        <tr key={itemData.sales_id}>
        <td>
            <button type="button" className="btn btn-link" onClick={this.selectModalSales.bind(this, itemData.sales_id) }>{itemData.sales_no}</button></td>
        <td>{itemData.sales_name}</td>
                            </tr>
                        ;
                    return out_html;
                })
                }
                </tbody>
            </table>
        </div>
                        </ModalSales>
                );
            }

            outHtml = (
                <div>
    <ul className="breadcrumb">
        <li><i className="fa-list-alt"></i> {this.props.menuName}</li>
        </ul>
    <h4 className="title"> {this.props.caption} 基本資料維護</h4>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">
            <div className="alert alert-warning">
                <p><strong className="text-danger">紅色標題</strong> 為必填欄位。</p>
                </div>
            </div>
        <div className="col-xs-6">

            <div className="form-group">
                <label className="col-xs-2 control-label text-danger">購買編號</label>
                <div className="col-xs-10">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'purchase_no') }
                        value={fieldData.purchase_no}
                        maxLength={16}
                        disabled={this.state.edit_type == 2}
                        required />
                    </div>
                </div>



            <div className="form-group">
                <label className="col-xs-2 control-label text-danger">購買日期</label>
                <div className="col-xs-10">
                    <InputDate id="join_date"
                        onChange={this.changeFDValue}
                        field_name="set_date"
                        value={fieldData.set_date}
                        disabled={false} required={true} ver={1} />
                    </div>
                </div>

            </div>
        <div className="col-xs-6">

            <div className="form-group">
                <label className="col-xs-2 control-label text-danger">購買人</label>
                <div className="col-xs-10">
                    <div className="input-group">
                        <input type="text"
                            className="form-control"
                            onChange={this.changeFDValue.bind(this, 'sales_name') }
                            value={fieldData.sales_name}
                            maxLength={32}
                            required />
                        <span className="input-group-btn">
                            <a className="btn" onClick={this.openModalSales}
                                disabled={false}><i className="fa fa-search"></i></a>
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        <div className="col-xs-12">
            <div className="form-action">
                <div className="col-xs-10 col-xs-offset-2">
                    <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                    <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                    </div>
                </div>
            </div>
        </form>
    {out_ModalSales}
                    </div>
            );
        }

        return outHtml;
    }
}

var dom = document.getElementById('page_content');
React.render(<GirdFormPurchase caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);