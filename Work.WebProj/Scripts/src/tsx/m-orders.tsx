namespace Orders {
    interface Rows {
        check_del: boolean,
        order_id: string;
        order_day: any;
        member_id: string;
        member_name: string;
        category_name: string;
        product_name: string;
        model_type: string;
        sort: number;
        i_Hide: boolean;
    }
    interface SearchData {
        //搜尋 參數
        name?: string
    }
    interface OrderState<G, F, S> extends BaseDefine.GirdFormStateBase<G, F, S> {
        //額外擴充 表單 State參數
        detail_list?: Array<server.OrderDetail>
    }
    interface CallResult extends IResultBase {
        id: string
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
                        <GridButtonModify modify={this.modify} ver={2}/>
                        </td>
                    <td>{this.props.itemData.order_id}</td>
                    <td>{moment(this.props.itemData.order_day).format('YYYY/MM/DD') }</td>
                    <td>{this.props.itemData.member_name}</td>
                </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, OrderState<Rows, server.Order, SearchData>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.queryGridDeatilData = this.queryGridDeatilData.bind(this);
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, detail_list: [], searchData: {} }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Order',
            InitPath: gb_approot + 'api/OrderDetail'
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
        queryGridDeatilData(order_id: number | string) {
            jqGet(this.props.InitPath, {})
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ detail_list: data });
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
                            this.updateType(data.id);
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
                    ids.push('ids=' + this.state.gridData.rows[i].order_id);
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
            this.setState({ edit_type: 1, fieldData: {} });
        }
        updateType(id: number | string) {

            jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.queryGridDeatilData(id);
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

    <h3 className="title">
        {this.props.caption}
        </h3>
    <form onSubmit={this.handleSearch}>
        <div className="table-responsive">
            <div className="table-header">
                <div className="table-filter">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>會員名稱</label> { }
                            <input type="text" className="form-control"
                                value={searchData.name}
                                onChange={this.changeGDValue.bind(this, 'name') }
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
                        <th className="col-xs-1 text-center">檢視</th>
                        <th className="col-xs-2">訂單編號</th>
                        <th className="col-xs-2">訂單日期</th>
                        <th className="col-xs-2">下單會員</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.order_id}
                                itemData={itemData}
                                delCheck={this.delCheck}
                                updateType={this.updateType}
                                />
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
            deleteSubmit={this.deleteSubmit}
            showAdd={false}/>
        </form>
                        </div>
                );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {

                let fieldData = this.state.fieldData;

                outHtml = (
                    <div>

    <h3 className="title"> { this.props.caption } 基本資料維護</h3>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">


            <div className="form-group">
                <label className="col-xs-2 control-label">訂單編號</label>
                <div className="col-xs-4">
                    <input type="number"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'order_id') }
                        value={fieldData.order_id}
                        disabled />
                    </div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">訂單日期</label>
                <div className="col-xs-4">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'order_day') }
                        value={moment(fieldData.order_day).format('YYYY/MM/DD') }
                        maxLength={16}
                        disabled />
                    </div>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">下單會員</label>
                <div className="col-xs-4">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'member_name') }
                        value={fieldData.member_name}
                        maxLength={16}
                        disabled />
                    </div>
                </div>
         {/*---產品訂購明細start---*/}
        <hr className="condensed" />
        <table className="table-condensed">
            <tbody>
            <tr>
                <th className="col-xs-2">訂單明細編號</th>
                <th className="col-xs-2">產品分類</th>
                <th className="col-xs-2">產品型號</th>
                <th className="col-xs-1">訂購數量</th>
                </tr>
                {
                this.state.detail_list.map((itemData, i) => {
                    let detail_html = (
                        <tr>
                            <td>{itemData.order_detail_id}</td>
                            <td>{itemData.category_name}</td>
                            <td>{itemData.model_type}</td>
                            <td>{itemData.qty}</td>
                            </tr>
                    );
                    return detail_html;
                })
                }
                </tbody>
            </table>
            {/*---產品訂購明細end---*/}
               <div className="form-action text-right">
                <div className="col-xs-5">
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
React.render(<Orders.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);