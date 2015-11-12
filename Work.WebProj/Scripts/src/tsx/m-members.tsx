namespace MembersData {
    interface Rows {
        check_del: boolean,
        member_id: number;
        tel: string;
        member_name: string;
        email: string;
        is_approve: boolean;
    }
    interface SearchData {
        //搜尋 參數
        name?: string
    }
    interface IssueCategoryState<G, F, S> extends BaseDefine.GirdFormStateBase<G, F, S> {
        //額外擴充 表單 State參數
    }
    interface CallResult extends IResultBase {
        //定義 回傳結果參數
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
                        <GridButtonModify modify={this.modify}/>
                        </td>
                    <td>{this.props.itemData.member_id}</td>
                    <td>{this.props.itemData.member_name}</td>
                    <td>{this.props.itemData.email}</td>
                    <td>{this.props.itemData.is_approve ? <span className="label label-success">認可</span> : <span className="label label-default">未認可</span>}</td>
                </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, IssueCategoryState<Rows, server.Member, SearchData>>{

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
            this.setFDValue = this.setFDValue.bind(this);
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, searchData: {} }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Member'
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
                    ids.push('ids=' + this.state.gridData.rows[i].member_id);
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
        setFDValue(fieldName, value) {
            //此function提供給次元件調用，所以要以屬性往下傳。
            var obj = this.state[this.props.fdName];
            obj[fieldName] = value;
            this.setState({ fieldData: obj });
        }
        render() {

            var outHtml: JSX.Element = null;

            if (this.state.edit_type == 0) {
                var searchData = this.state.searchData;
                outHtml =
                (
                    <div>
    <h3 className="title" dangerouslySetInnerHTML={{ __html: this.props.caption }}>
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
                        <th className="col-xs-1 text-center">修改</th>
                        <th className="col-xs-1">編號</th>
                        <th className="col-xs-2">姓名</th>
                        <th className="col-xs-2">EMail</th>
                        <th className="col-xs-1">狀態</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.member_id}
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
    <h3 className="title" dangerouslySetInnerHTML={{ __html: this.props.caption + ' 基本資料維護' }}></h3>
    <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">

            <div className="form-group">
                <label className="col-xs-2 control-label">會員編號</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'member_id') }
                        value={fieldData.member_id}
                        placeholder="系統自動產生"
                        disabled />
                    </div>
                </div>
            <div className="form-group">
                <label className="col-xs-2 control-label">會員姓名</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'member_name') }
                        value={fieldData.member_name}
                        maxLength={64}
                        required />
                    </div>
                   <small className="help-inline col-xs-5">最多64個字<span className="text-danger">(必填) </span></small>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">E-Mail</label>
                <div className="col-xs-5">
                    <input type="email"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'email') }
                        value={fieldData.email}
                        maxLength={256}
                        required />
                    </div>
                   <small className="help-inline col-xs-5">最多256個字<span className="text-danger">(必填) </span></small>
                </div>
             <div className="form-group">
                <label className="col-xs-2 control-label">電話</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'tel') }
                        value={fieldData.tel}
                        maxLength={10} />
                    </div>
                   <small className="help-inline col-xs-5">最多10個字</small>
                 </div>

                 <div className="form-group">
                     <label className="col-xs-2 control-label">地址</label>
                     <TwAddress
                         onChange={this.changeFDValue.bind(this) }
                         setFDValue={this.setFDValue.bind(this) }
                         zip_value={fieldData.tw_zip}
                         city_value={fieldData.tw_city}
                         country_value={fieldData.tw_country}
                         address_value={fieldData.tw_address}
                         zip_field="tw_zip"
                         city_field="tw_city"
                         country_field="tw_country"
                         address_field="tw_address" />
                     </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">會員帳號</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'member_account') }
                        value={fieldData.member_account}
                        maxLength={10}
                        required />
                    </div>
                   <small className="help-inline col-xs-5">最多10個字<span className="text-danger">(必填) </span></small>
                </div>
             <div className="form-group">
                <label className="col-xs-2 control-label">會員密碼</label>
                <div className="col-xs-5">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'member_password') }
                        value={fieldData.member_password}
                        required />
                    </div>
                   <small className="help-inline col-xs-5"><span className="text-danger">(必填) </span></small>
              </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">狀態</label>
                <div className="col-xs-2">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_approve"
                                value={true}
                                checked={fieldData.is_approve === true}
                                onChange={this.changeFDValue.bind(this, 'is_approve') }
                                />
                            <span>認可</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_approve"
                                value={false}
                                checked={fieldData.is_approve === false}
                                onChange={this.changeFDValue.bind(this, 'is_approve') }
                                />
                            <span>未認可</span>
                           </label>
                       </div>
                    </div>
                    <small className="help-inline col-xs-6">會員申請認可,認可後帳號才可正式使用</small>
                </div>

            <div className="form-action text-right">
                <div className="col-xs-5">
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
React.render(<MembersData.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);