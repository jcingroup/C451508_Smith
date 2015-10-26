namespace Product {
    interface Rows {
        check_del: boolean,
        product_no: string;
        product_type: number;
        product_name: string;
        price: number;
        standard: string;
        sort: number;
        memo: string;
        kvalue: number;
    }
    interface ProductCategory {
        product_category_id: number
        category_name: string
    }
    interface ComponentState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        category_option?: Array<ProductCategory>
    }
    interface CallResult extends IResultBase {
        product_no: string
    }

    class GridRow extends React.Component<BaseDefine.GridRowPropsBase<Rows>, BaseDefine.GridRowStateBase> {
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
                    <td>{this.props.itemData.product_no}</td>
                    <td>{this.props.itemData.product_name}</td>
                    <td>{this.props.itemData.price}</td>
                    <td>{this.props.itemData.kvalue}</td>
                </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, ComponentState<Rows, server.Product>>{

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
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, category_option: null }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Product'
        }
        componentDidMount() {

            jqGet(gb_approot + 'api/ProductCategory', {})
                .done((data: Array<ProductCategory>, textStatus, jqXHRdata) => {
                    this.setState({
                        category_option: data
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });

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

            return jqGet(this.props.apiPath, parms);
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
                jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: CallResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            tosMessage(null, '新增完成', 1);
                            this.updateType(data.product_no);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {
                jqPut(this.props.apiPath, this.state.fieldData)
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
                    ids.push('ids=' + this.state.gridData.rows[i].product_no);
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
            this.setState({ edit_type: 1, fieldData: { product_no: '', product_category_id: 1 } });
        }
        updateType(id: number | string) {

            jqGet(this.props.apiPath, { no: id })
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
                            <label>使用者名稱</label> { }
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
                        <th className="col-xs-2">品號</th>
                        <th className="col-xs-4">品名</th>
                        <th className="col-xs-2">單價</th>
                        <th className="col-xs-3">KV</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.product_no}
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

                let fieldData = this.state.fieldData;

                outHtml = (
                    <div>
    <ul className="breadcrumb">
        <li><i className="fa-list-alt"></i> {this.props.menuName}</li>
        </ul>
    <h4 className="title"> { this.props.caption } 基本資料維護</h4>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">
            <div className="alert alert-warning">
                <p><strong className="text-danger">紅色標題</strong> 為必填欄位。</p>
                </div>


            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">品號</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'product_no') }
                        value={fieldData.product_no}
                        maxLength={256}
                        disabled={this.state.edit_type == 2}
                        required />
                    </div>
                </div>


            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">品名</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'product_name') }
                        value={fieldData.product_name}
                        maxLength={256}
                        required />
                    </div>
                </div>

            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">單價</label>
                <div className="col-xs-5">
                    <input type="number"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'price') }
                        value={fieldData.price}
                        required />
                    </div>
                </div>




            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">KV</label>
                <div className="col-xs-6">
                    <input type="number"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'kvalue') }
                        value={fieldData.kvalue}
                        required />
                    </div>
                </div>

            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">產品分類</label>
                <div className="col-xs-6">
                    <select className="form-control"
                        value={fieldData.product_category_id}
                        onChange={this.changeFDValue.bind(this, 'product_category_id') }>
                        {
                        this.state.category_option.map((itemData, i) =>
                            <option key={itemData.product_category_id} value={itemData.product_category_id.toString() }>{itemData.category_name}</option>
                        )
                        }
                        </select>
                    </div>
                </div>

            <div className="form-group">
                <label className="col-xs-1 control-label text-danger">規格</label>
                <div className="col-xs-6">
                    <textarea className="form-control"
                        onChange={this.changeFDValue.bind(this, 'standard') }
                        value={fieldData.standard} />
                    </div>
                </div>

            <div className="form-action">
                <div className="col-xs-12">
                    <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
                    <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                    </div>
                </div>
            </div>
        </form>
                        </div>
                );
            }

            return outHtml;
        }
    }
}
var dom = document.getElementById('page_content');
React.render(<Product.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);