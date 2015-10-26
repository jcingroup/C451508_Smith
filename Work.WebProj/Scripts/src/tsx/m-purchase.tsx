namespace Purchase {

    interface Rows {
        check_del: boolean,
        purchase_no: string;
        set_date: Date;
        state: number;
        sales_id: number;
        sales_name: string;
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
                    <td>{this.props.itemData.purchase_no}</td>
                    <td>{this.props.itemData.sales_name}</td>
                    <td>{moment(this.props.itemData.set_date).format(dt.dateFT) }</td>
                    <td>{this.props.itemData.state}</td>
                </tr>;
        }
    }

    interface PurchaseState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {

        detailData?: Array<server.PurchaseDetail>;
        isShowModalSales?: boolean;
        ModalDataSales?: {
            search?: { keyword: string }
            queryItems?: Array<{ sales_id: number, sales_no: string, sales_name: string }>;
        }
    }
    interface PurchaseResult extends IResultBase {
        purchase_no: string
    }

    interface ModalSalesProps {
        isShow: boolean,
        fieldSalesId: number,
        fieldSalesName: string,
        setValue?(): void,
        close(): void
        updateView(sales_id: number, sales_name: string): void,
    }
    interface ModalSalesState {
        modalData?: Array<server.Sales>;
        keyword?: string;
    }
    class ModalSales extends React.Component<ModalSalesProps, ModalSalesState>{
        constructor() {
            super();
            this.close = this.close.bind(this);
            this.queryModal = this.queryModal.bind(this);
            this.setModalKeyword = this.setModalKeyword.bind(this);
            this.selectModal = this.selectModal.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                modalData: [],
                keyword: null
            }
        }

        close() {
            this.props.close();
        }
        queryModal() {
            jqGet(gb_approot + 'api/GetAction/GetModalQuerySales', { keyword: this.state.keyword })
                .done((data, textStatus, jqXHRdata) => {
                    var obj = this.state.modalData;
                    obj = data;
                    this.setState({ modalData: obj });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }
        setModalKeyword(e: React.SyntheticEvent) {

            let input: HTMLInputElement = e.target as HTMLInputElement;
            let getObj = this.state.keyword;
            getObj = input.value;
            this.setState({ keyword: getObj });
        }
        selectModal(sales_id: number, e: React.SyntheticEvent) {

            let qObj = this.state.modalData;

            qObj.map((item, index, ary) => {
                if (item.sales_id == sales_id) {
                    this.props.updateView(item.sales_id, item.sales_name);
                }
            });

            this.close();
        }

        render() {

            let out_html: JSX.Element = <div></div>;
            let ModalQ = ReactBootstrap.Modal;
            if (this.props.isShow) {
                out_html = (
                    <ModalQ bsSize="large" title="選擇購買人" onRequestHide={this.close}>
    <div className="modal-body">
        <div className="table-header">
            <div className="table-filter">
                <div className="form-inline">
                    <div className="form-group">
                        <label>購買編號</label> { }
                        <input type="text" className="form-control input-sm"
                            value={this.state.keyword}
                            />
                        </div>

                    <div className="form-group">
                        <button className="btn-primary btn-sm" onClick={this.queryModal}><i className="fa-search"></i> 搜尋</button>
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
                this.state.modalData.map((itemData, i) => {

                    var out_html =
                        <tr key={itemData.sales_id}>
<td>
<button type="button" className="btn btn-link" onClick={this.selectModal.bind(this, itemData.sales_id) }>{itemData.sales_no}</button></td>
<td>{itemData.sales_name}</td>
<td>{itemData.join_date}</td>
                            </tr>
                        ;
                    return out_html;
                })
                }
                </tbody>
            </table>
        </div>
                        </ModalQ>
                );
            }
            return out_html;
        }
    }

    export class GirdForm extends React.Component<BaseDefine.GridFormPropsBase, PurchaseState<Rows, server.Purchase>>{

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
            this.setModalValue = this.setModalValue.bind(this);
            this.updateItems = this.updateItems.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                fieldData: null,
                detailData: [],
                gridData: { rows: [], page: 1 }, edit_type: 0,
                isShowModalSales: false,
                ModalDataSales: { queryItems: [], search: { keyword: null } }
            }

        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Purchase',
            apiPathDetail: gb_approot + 'api/PurchaseDetail'
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
                    .done((data: PurchaseResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            tosMessage(null, '新增完成', 1);
                            this.updateType(data.purchase_no);
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
            this.setState({ edit_type: 1, fieldData: { purchase_no: '' }, detailData: [] });
        }
        updateType(no: number | string) {
            //get master data
            jqGet(this.props.apiPath, { no: no })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: 2, fieldData: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });

            jqGet(this.props.apiPathDetail, { purchase_no: no })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ detailData: data });
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

        updateItems(details: Array<server.PurchaseDetail>) {

            let obj = this.state.fieldData;
            let total: number = 0;
            details.map((item, i) => {
                item.sub_total = item.price * item.qty;
                total += item.sub_total;
            });

            obj.total = total;
            this.setState({ detailData: details, fieldData: obj });
        }
        setModalValue(sales_id: number, sales_name: string) {
            let obj = this.state.fieldData;
            obj.sales_id = sales_id;
            obj.sales_name = sales_name;
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
                        <th className="col-xs-2">購買編號</th>
                        <th className="col-xs-4">姓名</th>
                        <th className="col-xs-3">購買日期</th>
                        <th className="col-xs-2">狀態</th>
                        </tr>
                    </thead>
                <tbody>
                    {
                    this.state.gridData.rows.map(
                        (itemData, i) =>
                            <GridRow key={i}
                                ikey={i}
                                primKey={itemData.purchase_no}
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
  <h4 className="title"> {this.props.caption} 基本資料維護</h4>
  <form className="form-horizontal clearfix" onSubmit={this.handleSubmit}>
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

      <div className="form-group">
        <label className="col-xs-2 control-label text-danger">總計金額</label>
        <div className="col-xs-10">
          <div className="input-group">
            <label>{fieldData.total}</label>
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
    <ModalSales
        close={this.closeModalSales}
        isShow={this.state.isShowModalSales}
        fieldSalesId={this.state.fieldData.sales_id}
        fieldSalesName={this.state.fieldData.sales_name}
        updateView={this.setModalValue}
        />
    <Detail purchase_no={this.state.fieldData.purchase_no} items={this.state.detailData} updateItems={this.updateItems} />

                        </div>
                );
            }

            return outHtml;
        }
    }

    interface PurchaseDetailProps {
        purchase_no: string,
        items: Array<server.PurchaseDetail>,
        updateItems?(p1: Array<server.PurchaseDetail>): void,
        apiPath?: string
    }
    interface PurchaseDetailState {
        isShowModalProduct?: boolean,
        editKey?: number,
        editItem?: server.PurchaseDetail,
        copyItem?: server.PurchaseDetail
    }
    class Detail extends React.Component<PurchaseDetailProps, PurchaseDetailState>{

        constructor() {

            super();
            this.updateItem = this.updateItem.bind(this);
            this.newDetail = this.newDetail.bind(this);
            this.newCancel = this.newCancel.bind(this);
            this.submitNew = this.submitNew.bind(this);
            this.submitEdit = this.submitEdit.bind(this);
            this.openModalProduct = this.openModalProduct.bind(this);
            this.closeModalProduct = this.closeModalProduct.bind(this);
            this.render = this.render.bind(this);
            this.state = { isShowModalProduct: false, editKey: 0 }
        }
        static defaultProps = {
            items: [],
            apiPath: gb_approot + 'api/PurchaseDetail'
        }

        updateItem(index: number, detail: server.PurchaseDetail) {
            let obj: Array<server.PurchaseDetail> = this.props.items;
            let item = obj[index];

            item.purchase_detail_id = detail.purchase_detail_id;
            item.product_no = detail.product_no;
            item.product_name = detail.product_name;
            item.price = detail.price;
            item.qty = 0;
            item.sub_total = 0;

            this.props.updateItems(obj);
        }

        newDetail() {
            let obj: Array<server.PurchaseDetail> = this.props.items;
            obj.push({ edit_type: 1, purchase_no: this.props.purchase_no, product_no: null });
            this.props.updateItems(obj);
        }
        newCancel(e: React.MouseEvent) {
            let obj = this.props.items;
            obj.splice(-1, 1);
            this.props.updateItems(obj);
        }
        editDetail(index: number, e: React.MouseEvent) {
            let obj = this.props.items;
            let item = obj[index];
            this.state.copyItem = clone(item);
            item.edit_type = 2;

            this.props.updateItems(obj);
        }
        editCancel(index: number, e: React.MouseEvent) {
            let obj = this.props.items;
            let item = obj[index];

            item.qty = this.state.copyItem.qty;
            item.edit_type = 0;

            this.state.copyItem = null;
            this.props.updateItems(obj);
        }
        submitNew(e: React.MouseEvent) {
            let obj = this.props.items;
            let item = obj.slice(-1)[0]; //新增的該筆資料一定是陣列的最後一筆

            jqPost(this.props.apiPath, item)
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        tosMessage(null, '增新完成', 1);
                        item.edit_type = 0;
                        item.purchase_detail_id = data.id;
                        this.props.updateItems(obj);
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }
        submitEdit(index: number) {
            let obj = this.props.items;
            let item = obj[index];

            jqPut(this.props.apiPath, item)
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        tosMessage(null, '修改完成', 1);
                        item.edit_type = 0;
                        this.props.updateItems(obj);
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }
        submitDelete(index: number) {

            if (!confirm('是否刪除?')) {
                return;
            }

            let obj = this.props.items;
            let item = obj[index];

            jqDelete(this.props.apiPath + '?id=' + item.purchase_detail_id, {})
                .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        tosMessage(null, '刪除完成', 1);
                        obj.splice(index, 1);
                        this.props.updateItems(obj);
                    } else {
                        alert(data.message);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }

        setValue(index: number, field: string, e: React.SyntheticEvent) {
            let obj = this.props.items;
            let item = obj[index];
            let input: HTMLInputElement = e.target as HTMLInputElement;
            item[field] = input.value;
            item.sub_total = item.qty * item.price;
            this.props.updateItems(obj);
        }

        openModalProduct(index: number, item: server.PurchaseDetail, e: React.MouseEvent) {
            this.setState({ isShowModalProduct: true, editKey: index, editItem: item })
        }
        closeModalProduct() {
            this.setState({ isShowModalProduct: false, editKey: 0 })
        }

        render() {
            return (
                <div>
  <div className="row">
    <div className="col-xs-12">
      <table className="table-condensed">
        <caption>
            產品購買清單
            <button type="button" onClick={this.newDetail}>新增</button>
            </caption>
        <tbody>
          <tr>
            <th className="col-xs-1">編輯</th>
            <th className="col-xs-1">項次</th>
            <th className="col-xs-2">品號</th>
            <th className="col-xs-4">品名</th>
            <th className="col-xs-1">單價</th>
            <th className="col-xs-1">購買數量</th>
            <th className="col-xs-2">小計</th>
              </tr>
          {
          this.props.items.map((detail, i) => {
              let out_detail_html: JSX.Element;
              let oper_button: JSX.Element;

              if (detail.edit_type == 0) {
                  oper_button = (
                      <div>
                      <button className="btn btn-link text-danger" title="刪除" onClick={this.submitDelete.bind(this, i) }>
                          <span className="glyphicon glyphicon-remove"></span>
                          </button>
                        <button className="btn btn-link text-success" onClick={this.editDetail.bind(this, i) } title="編輯">
                            <span className="glyphicon glyphicon-pencil"></span>
                            </button>
                          </div>
                  );
              }

              if (detail.edit_type == 1) {
                  oper_button = (
                      <div>
                      <button className="btn btn-link text-danger" onClick={this.newCancel} title="放棄">
                          <span className="glyphicon glyphicon-share-alt"></span>
                          </button>
                      <button className="btn btn-link text-right" onClick={this.submitNew}>
                              <span className="glyphicon glyphicon glyphicon-ok"  title="確認"></span>
                          </button>
                          </div>
                  );
              }

              if (detail.edit_type == 2) {
                  oper_button = (
                      <div>
                      <button className="btn btn-link text-danger" onClick={this.editCancel.bind(this, i) } title="放棄">
                          <span className="glyphicon glyphicon-share-alt"></span>
                          </button>
                          <button className="btn btn-link text-right" onClick={this.submitEdit.bind(this, i) } title="確認">
                              <span className="glyphicon glyphicon glyphicon-ok"></span>
                              </button>
                          </div>
                  );
              }

              out_detail_html = (
                  <tr>
    <td>
        {oper_button}
        </td>
  <td>{detail.item_no}</td>
  <td>{detail.product_no}</td>
  <td>
    <div className="form-group">
      <label className="col-xs-10 control-label">{detail.product_name}</label>
      <div className="col-xs-2">
        <span className="input-group-btn">
         <a className="btn"
             disabled={detail.edit_type == 0 || detail.edit_type == 2}
             onClick={this.openModalProduct.bind(this, i, detail) }>
                                          <i className="fa fa-search"></i>
             </a>
            </span>
          </div>
        </div>
      </td>
  <td><input type="number" value={detail.price}  /></td>
  <td><input type="number" value={detail.qty} onChange={this.setValue.bind(this, i, 'qty') } disabled={detail.edit_type == 0} /></td>
  <td><input type="number" value={detail.sub_total} /></td>
                      </tr>
              )

              return out_detail_html;
          })
          }
            </tbody>
          </table>
        </div>
      </div>
                <ModalProduct
                    isShow={this.state.isShowModalProduct}
                    editIndex={this.state.editKey}
                    item={this.state.editItem}
                    close={this.closeModalProduct}
                    updateItem={this.updateItem}
                    />
                    </div>
            )
        }
    }

    interface ModalProductProps {
        editIndex: number,
        isShow: boolean,
        item: server.PurchaseDetail,
        setValue?(): void,
        close?(): void
        updateItem?(index: number, detail: server.PurchaseDetail): void,
    }
    interface ModalProductState {
        modalData?: Array<{ product_no: string, product_name: string, price: number }>,
        keyword?: string
    }
    class ModalProduct extends React.Component<ModalProductProps, ModalProductState>{
        constructor() {
            super();

            this.close = this.close.bind(this);
            this.queryModal = this.queryModal.bind(this);
            this.setModalKeyword = this.setModalKeyword.bind(this);
            this.selectModal = this.selectModal.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                modalData: [],
                keyword: null
            }
        }

        updateItem(obj) {
            //this.props.updateItem(obj);
        }
        close() {
            this.props.close();
        }
        queryModal() {
            jqGet(gb_approot + 'api/GetAction/GetModalQueryProduct', { keyword: this.state.keyword })
                .done((data, textStatus, jqXHRdata) => {
                    var obj = this.state.modalData;
                    obj = data;
                    this.setState({ modalData: obj });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    showAjaxError(errorThrown);
                });
        }
        setModalKeyword(e: React.SyntheticEvent) {

            let input: HTMLInputElement = e.target as HTMLInputElement;
            let getObj = this.state.keyword;
            getObj = input.value;
            this.setState({ keyword: getObj });
        }
        selectModal(product_no: string, e: React.SyntheticEvent) {

            let qObj = this.state.modalData;

            qObj.map((item, index, ary) => {

                if (item.product_no == product_no) {
                    let obj: server.PurchaseDetail = this.props.item;
                    obj.product_no = item.product_no;
                    obj.product_name = item.product_name;
                    obj.price = item.price;
                    this.props.updateItem(this.props.editIndex, obj);
                }
            });

            this.close();
        }

        static defaultProps = {
            isShow: false
        }
        render() {

            let out_html: JSX.Element = <div></div>;
            let ModalQ = ReactBootstrap.Modal;

            if (this.props.isShow) {
                out_html = (
                    <ModalQ bsSize="large" title="選擇產品" onRequestHide={this.close}>
    <div className="modal-body">
        <div className="table-header">
            <div className="table-filter">
                <div className="form-inline">
                    <div className="form-group">
                        <label>購買編號</label> { }
                        <input type="text" className="form-control input-sm"
                            />
                        </div>

                    <div className="form-group">
                        <button className="btn-primary btn-sm" onClick={this.queryModal}><i className="fa-search"></i> 搜尋</button>
                        </div>
                    </div>
                </div>
            </div>
        <table className="table-condensed">
            <tbody>
                <tr>
                    <th className="col-xs-3">品號</th>
                    <th className="col-xs-3">品名</th>
                    <th className="col-xs-3">單價</th>
                    </tr>
                {
                this.state.modalData.map((itemData, i) => {

                    var out_html =
                        <tr key={itemData.product_no}>
        <td>
            <button type="button" className="btn btn-link" onClick={this.selectModal.bind(this, itemData.product_no) }>{itemData.product_no}</button></td>
        <td>{itemData.product_name}</td>
        <td>{itemData.price}</td>
                            </tr>
                        ;
                    return out_html;
                })
                }
                </tbody>
            </table>
        </div>
                        </ModalQ>
                );
            }

            return out_html
        }
    }
}
var dom = document.getElementById('page_content');
React.render(<Purchase.GirdForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);