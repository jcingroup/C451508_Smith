interface JQuery {
    datetimepicker(p: any): JQuery;
};

module BaseDefine {
    //base interface
    export interface GridRowPropsBase<R> {
        key?: number,
        ikey: number,
        itemData: R,
        chd?: boolean,
        delCheck(p1: number, p2: boolean): void,
        updateType(p1: number | string): void,
        primKey: number | string
    }
    export interface GridRowStateBase { }

    export interface GridFormPropsBase {
        apiPath?: string,
        apiPathDetail?: string,
        InitPath?: string;
        gdName?: string,
        fdName?: string,
        menuName?: string,
        caption?: string,
        iconClass?: string,
        showAdd?: boolean
    }
    export interface GirdFormStateBase<G, F, S> {
        gridData?: {
            rows: Array<G>,
            page: number,
            startcount?: number,
            endcount?: number,
            total?: number,
            records?: number
        },
        fieldData?: F,
        searchData?: S,
        edit_type?: number,
        checkAll?: boolean
    }
}

// Component
class GridButtonModify extends React.Component<{ modify(): void }, {}> {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.modify();
    }
    render() {
        return <button type="button" className="btn-link btn-lg" onClick={this.onClick}><i className="fa-pencil"></i></button>
    }
}
class GridCheckDel extends React.Component<
    { delCheck(p1: any, p2: any): void, iKey: number, chd: boolean, showAdd?: boolean, }, any> {

    constructor() {
        super()
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.props.delCheck(this.props.iKey, this.props.chd);
    }
    render() {
        return <label className="cbox">
                    <input type="checkbox" checked={this.props.chd} onChange={this.onChange} />
                    <i className="fa-check"></i>
            </label>
    }
}

class InputDate extends React.Component<{
    id: string,
    value: Date,
    onChange(p1: string, e: React.SyntheticEvent): void,
    field_name: string,
    required: boolean,
    disabled: boolean,
    ver: number
}, any>{

    constructor(props) {
        super(props)
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onChange = this.onChange.bind(this);
        this.render = this.render.bind(this);
    }
    static defaultProps = {
        id: null,
        value: null,
        onChange: null,
        field_name: null,
        required: false,
        disabled: false,
        ver: 1
    }

    componentDidMount() {
        $('#' + this.props.id).datetimepicker(
            {
                format: 'YYYY-MM-DD',
                icons: {
                    previous: "fa-angle-left",
                    next: "fa-angle-right"
                }
            }).on('dp.change', function (e) {
                this.props.onChange(this.props.field_name, e);
            }.bind(this));
    }
    onChange(e) {
        console.log('onChange', 'datetimepicker1');
        this.props.onChange(this.props.field_name, e);
        console.log('onChange', 'datetimepicker2');
    }

    render() {
        var out_html = null;
        if (this.props.ver == 1) {
            out_html = (
                <div>
                    <input
                        type="date"
                        className="form-control datetimepicker"
                        id={this.props.id}
                        name={this.props.field_name}
                        value={this.props.value != undefined ? moment(this.props.value).format(dt.dateFT) : ''}
                        onChange={this.onChange}
                        required={this.props.required}
                        disabled={this.props.disabled} />
                    <i className="fa-calendar form-control-feedback"></i>
                    </div>
            );
        } else if (this.props.ver == 2) {
            out_html = (
                <div>
                    <input
                        type="date"
                        className="form-control input-sm datetimepicker"
                        id={this.props.id}
                        name={this.props.field_name}
                        value={this.props.value != undefined ? moment(this.props.value).format(dt.dateFT) : ''}
                        onChange={this.onChange}
                        required={this.props.required}
                        disabled={this.props.disabled} />
                        <i className="fa-calendar form-control-feedback"></i>
                    </div>
            );
        }

        return out_html;
    }
}

interface GridNavPageProps {
    onQueryGridData(p1: number): void,
    InsertType(): void,
    deleteSubmit(): void,
    nowPage: number,
    totalPage: number,
    startCount: number,
    endCount: number,
    recordCount: number,
    showAdd?: boolean,
    showDelete?: boolean
}

class GridNavPage extends React.Component<GridNavPageProps, any> {

    constructor(props) {
        super(props)
        this.nextPage = this.nextPage.bind(this);
        this.prvePage = this.prvePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }
    static defaultProps = {
        showAdd: true,
        showDelete: true
    };

    firstPage() {
        this.props.onQueryGridData(1);
    }
    lastPage() {
        this.props.onQueryGridData(this.props.totalPage);
    }
    nextPage() {
        if (this.props.nowPage < this.props.totalPage) {
            this.props.onQueryGridData(this.props.nowPage + 1);
        }
    }
    prvePage() {
        if (this.props.nowPage > 1) {
            this.props.onQueryGridData(this.props.nowPage - 1);
        }
    }
    jumpPage() {

    }
    render() {
        var setAddButton = null, setDeleteButton = null;
        if (this.props.showAdd) {
            setAddButton = <button className="btn-link text-success"
                type="button"
                onClick={this.props.InsertType}>
                            <i className="fa-plus-circle"></i> 新增
                </button>;
        }

        if (this.props.showDelete) {
            setDeleteButton = <button className="btn-link text-danger" type="button"
                onClick={this.props.deleteSubmit}>
                                    <i className="fa-trash-o"></i> 刪除
                </button>;

        }
        var oper = null;

        oper = (
            <div className="table-footer">
                <div className="pull-left">
                    {setAddButton}
                    {setDeleteButton}
                    </div>
                <small className="pull-right">第{this.props.startCount}-{this.props.endCount}筆，共{this.props.recordCount}筆</small>

                <ul className="pager">
                    <li>
                        <a href="#" title="移至第一頁" tabIndex={-1} onClick={this.firstPage}>
                            <i className="fa-angle-double-left"></i>
                            </a>
                        </li> { }
                    <li>
                        <a href="#" title="上一頁" tabIndex={-1} onClick={this.prvePage}>
                            <i className="fa-angle-left"></i>
                            </a>
                        </li> { }
                    <li className="form-inline">
                        <div className="form-group">
                            <label>第</label>
                            {' '}
                            <input className="form-control text-center" type="number" min="1" tabIndex={-1} value={this.props.nowPage.toString() }
                                onChange={this.jumpPage} />
                            {' '}
                            <label>頁，共{this.props.totalPage}頁</label>
                            </div>
                        </li> { }
                    <li>
                        <a href="#" title="@Resources.Res.NextPage" tabIndex={-1} onClick={this.nextPage}>
                            <i className="fa-angle-right"></i>
                            </a>
                        </li> { }
                    <li>
                        <a href="#" title="移至最後一頁" tabIndex={-1} onClick={this.lastPage}>
                            <i className="fa-angle-double-right"></i>
                            </a>
                        </li>
                    </ul>
                </div>
        );

        return oper;
    }
}