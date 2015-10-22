var GridRow = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},
	delCheck:function(i,chd){
		this.props.delCheck(i,chd);
	},
	modify:function(){
		this.props.updateType(this.props.primKey);
	},
	render:function(){
		return (
				<tr>
					<td className="text-center"><GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} /></td>
					<td className="text-center"><GridButtonModify modify={this.modify}/></td>
					<td>{this.props.itemData.user_name_c}</td>					
					<td>{this.props.itemData.UserName}</td>
					<td>{this.props.itemData.Email}</td>
				</tr>
			);
		}
});

//主表單
var GirdForm = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return {
			gridData:{rows:[],page:1},
			fieldData:{
				role_array:[]
			},
			searchData:{title:null},
			edit_type:0,
			checkAll:false
		};  
	},
	getDefaultProps:function(){

		var role_description = [];
		role_description['Managers'] = '管理者:所有功能';
		role_description['Sales'] = '業務:客戶進貨登打、報表R01、報表R02';
		return{	
			fdName:'fieldData',
			gdName:'searchData',
			apiPathName:gb_approot+'api/Users',
			roleDescription:role_description
		};
	},	
	componentDidMount:function(){
		//只在客戶端執行一次，當渲染完成後立即執行。當生命週期執行到這一步，元件已經俱有 DOM 所以我們可以透過 this.getDOMNode() 來取得 DOM 。
		//如果您想整和其他 Javascript framework ，使用 setTimeout, setInterval, 或者是發動 AJAX 請在這個方法中執行這些動作。
		this.queryGridData(1);
	},
	handleSubmit: function(e) {

		e.preventDefault();
		if(this.state.edit_type==1){
			jqPost(this.props.apiPathName,this.state.fieldData)
			.done(function(data, textStatus, jqXHRdata) {
				if(data.result){
					tosMessage(null,'新增完成',1);
					this.updateType(data.aspnetid);
				}else{
					alert(data.message);
				}
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
		}		
		else if(this.state.edit_type==2){
			jqPut(this.props.apiPathName,this.state.fieldData)
			.done(function(data, textStatus, jqXHRdata) {
				if(data.result){
					tosMessage(null,'修改完成',1);
				}else{
					alert(data.message);
				}
			}.bind(this))
			.fail(function( jqXHR, textStatus, errorThrown ) {
				showAjaxError(errorThrown);
			});
		};
		return;
	},
	deleteSubmit:function(e){

		if(!confirm('確定是否刪除?')){
			return;
		}

		var ids = [];
		for(var i in this.state.gridData.rows){
			if(this.state.gridData.rows[i].check_del){
				ids.push('ids='+this.state.gridData.rows[i].Id);
			}
		}

		if(ids.length==0){
			tosMessage(null,'未選擇刪除項',2);
			return;
		}

		jqDelete(this.props.apiPathName + '?' + ids.join('&'),{})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				tosMessage(null,'刪除完成',1);
				this.queryGridData(0);
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	handleSearch:function(e){
		e.preventDefault();
		this.queryGridData(0);
		return;
	},
	delCheck:function(i,chd){

		var newState = this.state;
		this.state.gridData.rows[i].check_del = !chd;
		this.setState(newState);
	},
	checkAll:function(){

		var newState = this.state;
		newState.checkAll = !newState.checkAll;
		for (var prop in this.state.gridData.rows) {
			this.state.gridData.rows[prop].check_del=newState.checkAll;
		}
		this.setState(newState);
	},
	gridData:function(page){

		var parms = {
			page:0
		};

		if(page==0){
			parms.page=this.state.gridData.page;
		}else{
			parms.page=page;
		}

		$.extend(parms, this.state.searchData);

		return jqGet(this.props.apiPathName,parms);
	},
	queryGridData:function(page){
		this.gridData(page)
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({gridData:data});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	insertType:function(){
		jqGet(gb_approot + 'api/GetAction/GetInsertRoles',{})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:1,fieldData:{role_array:data}});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	updateType:function(id){
		jqGet(this.props.apiPathName,{id:id})
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:2,fieldData:data.data});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	noneType:function(){
		this.gridData(0)
		.done(function(data, textStatus, jqXHRdata) {
			this.setState({edit_type:0,gridData:data});
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			showAjaxError(errorThrown);
		});
	},
	changeFDValue:function(name,e){
		this.setInputValue(this.props.fdName,name,e);
	},
	changeGDValue:function(name,e){
		this.setInputValue(this.props.gdName,name,e);
	},
	setFDValue:function(fieldName,value){
		//此function提供給次元件調用，所以要以屬性往下傳。
		var obj = this.state[this.props.fdName];
		obj[fieldName] = value;
		this.setState({fieldData:obj});
	},
	setInputValue:function(collentName,name,e){

		var obj = this.state[collentName];
		if(e.target.value=='true'){
			obj[name] = true;
		}else if(e.target.value=='false'){
			obj[name] = false;
		}else{
			obj[name] = e.target.value;
		}
		this.setState({fieldData:obj});
	},
	setRolesCheck:function(index,e){
		var obj = this.state[this.props.fdName];
		var roleObj = obj['role_array'];
		var item = roleObj[index];
		item.role_use = !item.role_use;
		this.setState({fieldData:obj});
	},
	render: function() {
		var outHtml = null;

		if(this.state.edit_type==0)
		{
			var searchData = this.state.searchData;

			outHtml =
			(
			<div>
				<ul className="breadcrumb">
					<li><i className="fa-list-alt"></i> {this.props.MenuName}</li>
				</ul>
				<h3 className="title">
					{this.props.Caption}
				</h3>
				<form onSubmit={this.handleSearch}>
					<div className="table-responsive">
						<div className="table-header">
							<div className="table-filter">
								<div className="form-inline">
									<div className="form-group">
										<label>使用者名稱</label> { }
										<input type="text" className="form-control" 
										value={searchData.UserName}
										onChange={this.changeGDValue.bind(this,'UserName')}
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
									<th className="col-xs-2">姓名</th>
									<th className="col-xs-2">帳號</th>
									<th className="col-xs-7">Email</th>
								</tr>
							</thead>
							<tbody>
								{
								this.state.gridData.rows.map(function(itemData,i) {
								return <GridRow 
										key={i}
										ikey={i}
										primKey={itemData.Id} 
										itemData={itemData} 
										delCheck={this.delCheck}
										updateType={this.updateType}								
								/>;
								}.bind(this))
								}
							</tbody>
						</table>
					</div>
					<GridNavPage 
						StartCount={this.state.gridData.startcount}
						EndCount={this.state.gridData.endcount}
						RecordCount={this.state.gridData.records}
						TotalPage={this.state.gridData.total}
						NowPage={this.state.gridData.page}
						onQueryGridData={this.queryGridData}
						InsertType={this.insertType}
						deleteSubmit={this.deleteSubmit}
					/>
				</form>
			</div>
			);
		}
		else if(this.state.edit_type==1 || this.state.edit_type==2)
		{
			var fieldData = this.state.fieldData;

			outHtml=(
			<div>
				<ul className="breadcrumb">
					<li><i className="fa-list-alt"></i> {this.props.MenuName}</li>
				</ul>
				<h4 className="title">{this.props.Caption} 基本資料維護</h4>
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="col-xs-8">
						<div className="alert alert-warning">
							<p><strong className="text-danger">紅色標題</strong> 為必填欄位。</p>
						</div>
						<div className="form-group">
							<label className="col-xs-2 control-label text-danger">帳號</label>
							<div className="col-xs-6">
								<input type="text" 							
								className="form-control"	
								value={fieldData.UserName}
								onChange={this.changeFDValue.bind(this,'UserName')}
								maxLength="256"
								required />
							</div>
						</div>
						<div className="form-group">
							<label className="col-xs-2 control-label text-danger">密碼</label>
							<div className="col-xs-6">
								<input type="password" 							
								className="form-control"	
								value={fieldData.PasswordHash}
								onChange={this.changeFDValue.bind(this,'PasswordHash')}
								maxLength="256"
								required />
							</div>
							<small className="col-xs-4 help-inline">至少6個字元</small>
						</div>

						<div className="form-group">
							<label className="col-xs-2 control-label text-danger">姓名</label>
							<div className="col-xs-6">
								<input type="text" 							
								className="form-control"	
								value={fieldData.user_name_c}
								onChange={this.changeFDValue.bind(this,'user_name_c')}
								maxLength="32"
								required />
							</div>
							<label className="col-xs-1 control-label">排序</label>
							<div className="col-xs-2">
								<input type="number" 
								className="form-control"
								value={fieldData.sort}
								onChange={this.changeFDValue.bind(this,'sort')} />
							</div>
						</div>
						<div className="form-group">
							<label className="col-xs-2 control-label text-danger">Email</label>
							<div className="col-xs-9">
								<input type="email" 
								className="form-control"	
								value={fieldData.Email}
								onChange={this.changeFDValue.bind(this,'Email')}
								maxLength="256"
								required
								 />
							</div>
						</div>

						<div className="form-group">
							<label className="col-xs-2 control-label">角色</label>
							<div className="col-xs-10">
							{
								fieldData.role_array.map(function(itemData,i) {

									var out_check = 							
									<div className="checkbox" key={itemData.role_id}>
										<label>
											<input  type="checkbox" 
													checked={itemData.role_use}
													onChange={this.setRolesCheck.bind(this,i)}
											 />
											{itemData.role_name + '(' + this.props.roleDescription[itemData.role_name] + ')'}
										</label>
									</div>;
									return out_check;

								}.bind(this))
							}
							</div>
						</div>

						<div className="form-group">
							<small className="col-xs-10 col-xs-offset-2 help-inline">兩種角色在平板端的功能皆相同，只有PC端才有差別</small>
						</div>

						<div className="form-action">
							<div className="col-xs-10 col-xs-offset-2">
								<button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button> { }
								<button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
							</div>
						</div>
					</div>
				</form>
			</div>
			);
		}else{
			outHtml=(<span>No Page</span>);
		}

		return outHtml;
	}
});