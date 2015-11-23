namespace OrderW {

    export class GirdForm extends React.Component<any, {
        ProductList?: Array<server.OrderProduct>
        order_list?: Array<server.OrderDetailList>
    }>{

        constructor() {

            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.checkOrder = this.checkOrder.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                ProductList: [],
                order_list: []
            }

        }
        static defaultProps = {
            apiPath: gb_approot + 'api/GetAction/GetProductData',
            apiOrderPath: gb_approot + 'Products/sendOrderMail'
        }
        componentDidMount() {
            this.queryGridData();
        }
        queryGridData() {
            jqGet(this.props.apiPath, {})
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        this.setState({ ProductList: data.data });
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
        }
        changeFDValue(name: string, index: number, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.ProductList;

            if (name == "is_buy") {
                obj[index][name] = input.checked;
            } else {
                obj[index][name] = input.value;
            }

            let o_list: Array<server.OrderDetailList> = [];
            for (let i of obj) {
                //迴圈的i是物件值
                //可使用break，continue和return
                if (i.is_buy && i.qty > 0) {
                    o_list.push({ p_id: i.product_id, qty: i.qty, c_name: i.category_name, m_type: i.model_type });
                }
            }
            this.setState({ ProductList: obj, order_list: o_list });
        }
        checkOrder(e: React.FormEvent) {
            e.preventDefault();
            if (this.state.order_list.length == 0) {
                alert('未選購產品!')
                return;
            }
            if (!confirm('確定是否下單?')) {
                return;
            }
            console.log(this.state.order_list);
            jqPost(this.props.apiOrderPath, { order_list: this.state.order_list })
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        alert('已成功下單,請耐心等候通知~!')
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    showAjaxError(errorThrown);
                });
            return;
        }
        render() {
            var outHtml: JSX.Element = null;
            outHtml = (
                <div>
                    <form className="order-list" onSubmit={this.checkOrder}>
                        <table className="full" id="orderList">
                            <tr>
                                <th>產品名稱</th>
                                <th>型號</th>
                                <th>數量</th>
                                <th>我要購買</th>
                                </tr>

                            {
                            this.state.ProductList.map((itemData, i) => {
                                let category_html = null;
                                if (itemData.isFirst) {
                                    category_html = (<td rowSpan={itemData.count}>{itemData.category_name}</td>)
                                }
                                let out_sub_html = (
                                    <tr>
                                        {category_html}
                                        <td className="text-left">【{itemData.model_type}】</td>
                                        <td>
                                            <input type="number"
                                                value={itemData.qty}
                                                onChange={this.changeFDValue.bind(this, 'qty', i) }
                                                min={0}/>
                                            </td>
                                        <td>
                                            <input type="checkbox" name="buy" id={'check_' + itemData.product_id}
                                                value={itemData.is_buy}
                                                onChange={this.changeFDValue.bind(this, 'is_buy', i) }/>
                                            <label htmlFor={'check_' + itemData.product_id}></label>
                                            </td>
                                        </tr>
                                );
                                return out_sub_html;
                            })
                            }
                            </table>
                        <p className="text-center">
                            <button className="btn">確認訂單</button> {  }
                            <a className="btn" href="#orderList">繼續購買</a>
                            </p>
                        </form>
                    </div>

            );

            return outHtml;
        }
    }
}
var dom = document.getElementById('page_content');
React.render(<OrderW.GirdForm />, dom);