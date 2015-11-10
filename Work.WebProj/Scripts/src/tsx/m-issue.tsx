namespace Issue {
    interface Rows {
        check_del: boolean,
        issue_id: string;
        issue_category_id: number;
        category_name: string;
        issue_q: string;
        sort: number;
        i_Hide: boolean;
    }
    interface SearchData {
        //搜尋 參數
        name?: string
        issue_category_id?: number
    }
    interface IssueCategory {
        issue_category_id: number
        category_name: string
    }
    interface IssueState<G, F, S> extends BaseDefine.GirdFormStateBase<G, F, S> {
        //額外擴充 表單 State參數
        category_option?: Array<IssueCategory>
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
                        <GridButtonModify modify={this.modify}/>
                        </td>
                    <td>{this.props.itemData.category_name}</td>
                    <td>{this.props.itemData.issue_q}</td>
                    <td>{this.props.itemData.sort}</td>
                    <td>{this.props.itemData.i_Hide ? <span className="label label-default">隱藏</span> : <span className="label label-primary">顯示</span>}</td>
                </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, IssueState<Rows, server.Issue, SearchData>>{

        constructor() {

            super();
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
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, category_option: [], searchData: {} }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Issue',
            InitPath: gb_approot + 'Active/IssueData/aj_Init'
        }
        componentDidMount() {
            this.queryGridData(1);
            this.getInitData();
        }
        componentDidUpdate(prevProps, prevState) {
            if (prevState.edit_type == 0 && this.state.edit_type == 1) {
                CKEDITOR.replace('editor1', {});
            }
        }
        getInitData() {
            jqGet(this.props.InitPath, {})
                .done((data: Array<IssueCategory>, textStatus, jqXHRdata) => {
                    this.setState({
                        category_option: data
                    });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });

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
            this.state.fieldData.issue_ans = CKEDITOR.instances.editor1.getData();//編輯器
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
                    ids.push('ids=' + this.state.gridData.rows[i].issue_id);
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
            this.setState({ edit_type: 1, fieldData: { issue_category_id: this.state.category_option[0].issue_category_id, i_Hide: false } });
        }
        updateType(id: number | string) {

            jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: 2, fieldData: data.data });
                    CKEDITOR.replace('editor1', {});
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

    <h3 className="title" dangerouslySetInnerHTML={{ __html: this.props.caption }}>
        </h3>
    <form onSubmit={this.handleSearch}>
        <div className="table-responsive">
            <div className="table-header">
                <div className="table-filter">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>Q & A 標題</label> { }
                            <input type="text" className="form-control"
                                value={searchData.name}
                                onChange={this.changeGDValue.bind(this, 'name') }
                                placeholder="請輸入關鍵字..." /> { }

                             <label>問題分類</label> { }
                                <select className="form-control"
                                    value={searchData.issue_category_id}
                                    onChange={this.changeGDValue.bind(this, 'issue_category_id') }>
                                    <option  value="">全部分類</option>
                                    {
                                    this.state.category_option.map((itemData, i) =>
                                        <option key={itemData.issue_category_id} value={itemData.issue_category_id.toString() }>{itemData.category_name}</option>
                                    )
                                    }
                                </select>

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
                        <th className="col-xs-2">Q & A 分類</th>
                        <th className="col-xs-4">Q & A 標題</th>
                        <th className="col-xs-1">排序</th>
                        <th className="col-xs-1">狀態</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.issue_id}
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
                <label className="col-xs-2 control-label">問題分類</label>
                <div className="col-xs-4">
                    <select className="form-control"
                        value={fieldData.issue_category_id}
                        onChange={this.changeFDValue.bind(this, 'issue_category_id') }>
                        {
                        this.state.category_option.map((itemData, i) =>
                            <option key={itemData.issue_category_id} value={itemData.issue_category_id.toString() }>{itemData.category_name}</option>
                        )
                        }
                        </select>
                    </div>
                    <small className="help-inline col-xs-2"><span className="text-danger">(必填) </span></small>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">排序</label>
                <div className="col-xs-4">
                    <input type="number"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'sort') }
                        value={fieldData.sort} />
                    </div>
                <small className="col-xs-2 help-inline">數字越大越前面</small>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">狀態</label>
                <div className="col-xs-4">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="i_Hide"
                                value={true}
                                checked={fieldData.i_Hide === true}
                                onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                />
                            <span>隱藏</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="i_Hide"
                                value={false}
                                checked={fieldData.i_Hide === false}
                                onChange={this.changeFDValue.bind(this, 'i_Hide') }
                                />
                            <span>顯示</span>
                           </label>
                       </div>
                    </div>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">Q</label>
                <div className="col-xs-8">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'issue_q') }
                        value={fieldData.issue_q}
                        maxLength={128}
                        required />
                    </div>
                    <small className="help-inline col-xs-2">最多128個字<span className="text-danger">(必填) </span></small>
                </div>

                 <div className="form-group">
                     <label className="col-xs-2 control-label">A</label>
                        <div className="col-xs-8">
                            <textarea cols={30} rows={3} className="form-control" id="editor1"
                                value={fieldData.issue_ans}
                                onChange={this.changeFDValue.bind(this, 'issue_ans') }
                                maxLength={512}></textarea>
                            </div>
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
React.render(<Issue.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);