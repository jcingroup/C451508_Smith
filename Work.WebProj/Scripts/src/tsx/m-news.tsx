namespace News {
    interface Rows {
        check_del: boolean,
        news_id: number;
        news_title: string;
        news_date: Date;
        is_correspond: boolean;
        i_Hide: boolean;
    }
    interface SearchData {
        //搜尋 參數
        name?: string
    }
    interface NewsState<G, F, S> extends BaseDefine.GirdFormStateBase<G, F, S> {
        //額外擴充 表單 State參數
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
                    <td>{this.props.itemData.news_title}</td>
                    <td>{moment(this.props.itemData.news_date).format('YYYY/MM/DD') }</td>
                    <td>{this.props.itemData.is_correspond ? <span className="label label-success">對應</span> : <span className="label label-default">未對應</span>}</td>
                    <td>{this.props.itemData.i_Hide ? <span className="label label-default">隱藏</span> : <span className="label label-primary">顯示</span>}</td>
                </tr>;
        }
    }
    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, NewsState<Rows, server.News, SearchData>>{

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
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeCorrespondVal = this.changeCorrespondVal.bind(this);
            this.state = { fieldData: null, gridData: { rows: [], page: 1 }, edit_type: 0, searchData: {} }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/News'
        }
        componentDidMount() {
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if (prevState.edit_type == 0 && this.state.edit_type == 1) {
                CKEDITOR.replace('editor1', {});
            }
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
            this.state.fieldData.news_content = CKEDITOR.instances.editor1.getData();//編輯器
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
                    ids.push('ids=' + this.state.gridData.rows[i].news_id);
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
            this.setState({ edit_type: 1, fieldData: { is_correspond: false, i_Hide: false, news_date: format_Date(getNowDate()) } });
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
        changeCorrespondVal(e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData;
            if (input.value == 'true') {
                obj.is_correspond = true;
            } else if (input.value == 'false') {
                obj.is_correspond = false;
            }
            //console.log((this.refs['SubFrom']).state.grid_right_data.rows.length);
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
                            <label>最新消息標題</label> { }
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
                        <th className="col-xs-3">標題</th>
                        <th className="col-xs-2">日期</th>
                        <th className="col-xs-2">是否對應會員</th>
                        <th className="col-xs-2">狀態</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.news_id}
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
                var outDetailHtml: JSX.Element = null;
                if (this.state.edit_type == 2 && fieldData.is_correspond) {
                    outDetailHtml = (<GridNofM ref="SubFrom" main_id={fieldData.news_id} />);
                } else if (this.state.edit_type == 1) {
                    outDetailHtml = (
                        <div>
                            <hr className="condensed" />
                            <h4 className="title">會員對應設定</h4>
                            <div className="alert alert-warning">請先按上方的 <strong>存檔確認</strong>，再進行設定。</div>
                            </div>);
                } else if (!fieldData.is_correspond) {
                    outDetailHtml = (
                        <div>
                            <hr className="condensed" />
                            <h4 className="title">會員對應設定</h4>
                            <div className="alert alert-warning">請先將上方的「是否對應會員」改為 <strong>對應</strong>，再進行設定。</div>
                            </div>);
                }
                outHtml = (
                    <div>

    <h3 className="title"> { this.props.caption } 基本資料維護</h3>
    <form className="form-horizontal clearfix" onSubmit={this.handleSubmit}>
        <div className="col-xs-12">

            <div className="form-group">
                <label className="col-xs-2 control-label">標題</label>
                <div className="col-xs-4">
                    <input type="text"
                        className="form-control"
                        onChange={this.changeFDValue.bind(this, 'news_title') }
                        value={fieldData.news_title}
                        maxLength={64}
                        required />
                    </div>
                    <small className="help-inline col-xs-6">最多64個字<span className="text-danger">(必填) </span></small>
                </div>

            <div className="form-group">
                <label className="col-xs-2 control-label">日期</label>
                <div className="col-xs-4">
                    <span className="has-feedback">
                       <InputDate id="news_date"
                           ver={1}
                           onChange={this.changeFDValue.bind(this) }
                           field_name="news_date"
                           value={fieldData.news_date}
                           required={true}
                           disabled={false}/>
                        </span>
                    </div>
                <small className="help-inline col-xs-5"><span className="text-danger">(必填) </span></small>
                </div>


            <div className="form-group">
                <label className="col-xs-2 control-label">是否對應會員</label>
                <div className="col-xs-2">
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_correspond"
                                value={true}
                                checked={fieldData.is_correspond === true}
                                onChange={this.changeCorrespondVal.bind(this) }
                                />
                            <span>對應</span>
                           </label>
                       </div>
                   <div className="radio-inline">
                       <label>
                            <input type="radio"
                                name="is_correspond"
                                value={false}
                                checked={fieldData.is_correspond === false}
                                onChange={this.changeCorrespondVal.bind(this) }
                                />
                            <span>不對應</span>
                           </label>
                       </div>
                    </div>
                    <small className="help-inline col-xs-5">對應:指定會員才可檢視 , 不對應:全部會員皆可檢視</small>
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
                     <label className="col-xs-2 control-label">內容</label>
                        <div className="col-xs-8">
                            <textarea cols={30} rows={3} className="form-control"  id="editor1"
                                value={fieldData.news_content}
                                onChange={this.changeFDValue.bind(this, 'news_content') }></textarea>
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
                           {outDetailHtml}

                        </div>
                );
            }

            return outHtml;
        }
    }

    interface CorrespondState {
        grid_right_data?: {
            rows: Array<server.Member>,
            page: number,
            startcount?: number,
            endcount?: number,
            total?: number,
            records?: number
        };
        grid_left_data?: {
            rows: Array<server.Member>,
            page: number,
            startcount?: number,
            endcount?: number,
            total?: number,
            records?: number
        };
        searchData?: {
            main_id?: number;
            name?: string;
        };
    }
    class GridNofM extends React.Component<{
        main_id: number;
        apiLeftPath?: string;
        apiRightPath?: string;
        apiAddPath?: string;
        apiRemovePath?: string;
        ref: any;
    }, CorrespondState>{
        constructor() {
            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.queryLeftData = this.queryLeftData.bind(this);
            this.queryRightData = this.queryRightData.bind(this);
            this.addMember = this.addMember.bind(this);
            this.removeMember = this.removeMember.bind(this);
            this.querySearchData = this.querySearchData.bind(this);
            this.LeftGridPrev = this.LeftGridPrev.bind(this);
            this.LeftGridNext = this.LeftGridNext.bind(this);
            this.RightGridPrev = this.RightGridPrev.bind(this);
            this.RightGridNext = this.RightGridNext.bind(this);
            this.state = { grid_right_data: { rows: [], page: 1 }, grid_left_data: { rows: [], page: 1 }, searchData: {} }
        }
        static defaultProps = {
            apiLeftPath: gb_approot + 'api/GetAction/GetLeftData',
            apiRightPath: gb_approot + 'api/GetAction/GetRightData',
            apiAddPath: gb_approot + 'api/GetAction/PostNewsOfMember',
            apiRemovePath: gb_approot + 'api/GetAction/DeleteNewsOfMember'
        }
        componentDidMount() {
            this.queryRightData();
            this.queryLeftData();
        }

        queryLeftData() {
            var parms = {
                page: this.state.grid_left_data.page,
                main_id: this.props.main_id
            };

            $.extend(parms, this.state.searchData);

            jqGet(this.props.apiLeftPath, parms)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ grid_left_data: data });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
        }
        queryRightData() {
            var parms = {
                page: this.state.grid_right_data.page,
                main_id: this.props.main_id
            };

            $.extend(parms, this.state.searchData);

            jqGet(this.props.apiRightPath, parms)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ grid_right_data: data });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
        }
        querySearchData(name, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            var obj = this.state.searchData;
            obj[name] = input.value;
            this.setState({ searchData: obj });
            this.queryLeftData();
        }
        addMember(member_id) {
            jqPost(this.props.apiAddPath, { news_id: this.props.main_id, member_id: member_id })
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        this.queryLeftData();
                        this.queryRightData();
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
        }
        removeMember(member_id) {
            jqDelete(this.props.apiRemovePath, { news_id: this.props.main_id, member_id: member_id })
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        this.queryLeftData();
                        this.queryRightData();
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
        }
        LeftGridPrev() {
            if (this.state.grid_left_data.page > 1) {
                this.state.grid_left_data.page--;
                this.queryLeftData();
            }
        }
        LeftGridNext() {
            if (this.state.grid_left_data.page < this.state.grid_left_data.total) {
                this.state.grid_left_data.page++;
                this.queryLeftData();
            }
        }
        RightGridPrev() {
            if (this.state.grid_right_data.page > 1) {
                this.state.grid_right_data.page--;
                this.queryRightData();
            }
        }
        RightGridNext() {
            if (this.state.grid_right_data.page < this.state.grid_right_data.total) {
                this.state.grid_right_data.page++;
                this.queryRightData();
            }
        }
        render() {
            var outHtml: JSX.Element = null;
            let searchData = this.state.searchData;
            outHtml = (
                <div>
                    <hr className="condensed" />
                    <h4 className="title">會員對應設定</h4>
                    <div className="row">
                    <div className="col-xs-6">

                            <table className="table-condensed">
                                <caption>
                                    <div className="form-inline break pull-right">
                                        <div className="form-group">
                                            <input type="text" className="form-control input-sm" placeholder="請輸入關鍵字..."
                                                value={searchData.name}
                                                onChange={this.querySearchData.bind(this, 'name') } /> { }
                                            </div>
                                        </div>
                                    全部會員
                                    </caption>
                                <tbody>
                                    <tr>
                                        <th>會員名稱</th>
                                        <th>EMail</th>
                                        <th className="text-center">加入</th>
                                        </tr>
                                    {
                                    this.state.grid_left_data.rows.map((itemData, i) => {
                                        let out_sub_html = (
                                            <tr key={itemData.member_id}>
                                                    <td>{itemData.member_name}</td>
                                                    <td>{itemData.email}</td>
                                                    <td className="text-center">
                                                        <button className="btn-link text-success" type="button" onClick={this.addMember.bind(this, itemData.member_id) }>
                                                            <i className="fa-plus"></i>
                                                            </button>
                                                        </td>
                                                </tr>
                                        );
                                        return out_sub_html;
                                    })
                                    }
                                    </tbody>
                                </table>
                            <div className="form-inline text-center">
                                <ul className="pager list-inline list-unstyled">
                                    <li><a href="#" onClick={this.LeftGridPrev}><i className="glyphicon glyphicon-arrow-left"></i> 上一頁</a></li>
                                    <li>{this.state.grid_left_data.page + '/' + this.state.grid_left_data.total}</li>
                                    <li><a href="#" onClick={this.LeftGridNext}>下一頁 <i className="glyphicon glyphicon-arrow-right"></i></a></li>
                                    </ul>
                                </div>
                        </div>
                    <div className="col-xs-6">

                            <table className="table-condensed">
                                <caption>已加入對應會員</caption>
                                <tbody>
                                    <tr>
                                        <th>會員名稱</th>
                                        <th>EMail</th>
                                        <th className="text-center">刪除</th>
                                        </tr>
                                    {
                                    this.state.grid_right_data.rows.map((itemData, i) => {
                                        let out_sub_html = (
                                            <tr key={itemData.member_id}>
                                                    <td>{itemData.member_name}</td>
                                                    <td>{itemData.email}</td>
                                                    <td className="text-center">
                                                        <button className="btn-link text-danger" type="button" onClick={this.removeMember.bind(this, itemData.member_id) }>
                                                            <i className="fa-times"></i>
                                                            </button>
                                                        </td>
                                                </tr>
                                        );
                                        return out_sub_html;
                                    })
                                    }
                                    </tbody>
                                </table>
                                <div className="form-inline text-center">
                                    <ul className="pager list-inline list-unstyled">
                                        <li><a href="#" onClick={this.LeftGridPrev}><i className="glyphicon glyphicon-arrow-left"></i> 上一頁</a></li>
                                        <li>{this.state.grid_right_data.page + '/' + this.state.grid_right_data.total}</li>
                                        <li><a href="#" onClick={this.LeftGridNext}>下一頁 <i className="glyphicon glyphicon-arrow-right"></i></a></li>
                                        </ul>
                                    </div>
                        </div>

                        </div>
                    </div>

            );
            return outHtml;
        }
    }
}
var dom = document.getElementById('page_content');
React.render(<News.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);