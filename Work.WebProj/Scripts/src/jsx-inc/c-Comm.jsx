var GridButtonModify = React.createClass({
	getInitialState: function() {  
		return { 
			value:'c'
		};  
	},
	onClick:function(e){
		this.props.modify();
	},
	render:function(){
		return (
			<button type="button" className="btn-link btn-lg" onClick={this.onClick}><i className="fa-pencil"></i></button>
			);
	}
});

var GridButtonView = React.createClass({
	getInitialState: function() {  
		return { 
			value:'c'
		};  
	},
	onClick:function(e){
		this.props.modify();
	},
	render:function(){
		return (
			<button type="button" className="btn-link btn-lg" onClick={this.onClick}><i className="fa-search-plus"></i></button>
			);
	}
});
//popup window 修改按鈕
var GridButtonPopupWindow = React.createClass({
	getInitialState: function() {  
		return { 
		};  
	},
	onClick:function(e){
		this.props.modify();
	},
	render:function(){
		return (
			<button type="button" className="btn-link btn-lg" data-toggle="modal" data-target={'#myModal-'+this.props.MainId} onClick={this.onClick}><i className="fa-pencil"></i></button>
			);
	}
});
//縮放子類別按鈕
var GridButtonSub = React.createClass({
	getInitialState: function() {  
		return { 
			subHtml:'fa-plus'
		};  
	},
	componentWillReceiveProps:function(nextProps){
		//當元件收到新的 props 時被執行，這個方法在初始化時並不會被執行。使用的時機是在我們使用 setState() 並且呼叫 render() 之前您可以比對 props，舊的值在 this.props，而新值就從 nextProps 來。
		if(nextProps.chd){
			this.setState({subHtml:'fa-minus'});//展開
		}else{
			this.setState({subHtml:'fa-plus'});//合起
		}
	},
	onClick:function(e){
		this.props.subCheck(this.props.iKey,this.props.chd);
		this.props.chd=!this.props.chd;
		if(this.props.chd){
			this.setState({subHtml:'fa-minus'});//展開
		}else{
			this.setState({subHtml:'fa-plus'});//合起
		}
	},
	onChange:function(e){
		this.props.subCheck(this.props.iKey,this.props.chd);
		this.props.chd=!this.props.chd;
		if(this.props.chd){
			this.setState({subHtml:'fa-minus'});//展開
		}else{
			this.setState({subHtml:'fa-plus'});//合起
		}
	},
	render:function(){
		return (
			<button type="button" className="btn-link btn-lg" onClick={this.onClick}><i className={this.state.subHtml}></i></button>
			);
	}
});
var GridCheckDel = React.createClass({
	getInitialState: function() {  
		return { 
		};  
	},
	onChange:function(e){
		this.props.delCheck(this.props.iKey,this.props.chd);
	},
	render:function(){
		return (
			<label className="cbox">
				<input type="checkbox" checked={this.props.chd} onChange={this.onChange} />
				<i className="fa-check"></i>
			</label>
			);
	}
});

var GridNavPage = React.createClass({
	getInitialState: function() {  
		return {
		};  
	},
	getDefaultProps:function(){
		return{
			gridData:null,
			onQueryGridData:null,
			InsertType:0,
			UpdateType:null,
			deleteSubmit:null,
			showAdd:true,
			showDelete:true
		};
	},
	firstPage:function(){
		this.props.onQueryGridData(1);
	},
	lastPage:function(){
		this.props.onQueryGridData(this.props.TotalPage);
	},
	nextPage:function(){
		if(this.props.NowPage < this.props.TotalPage){
			this.props.onQueryGridData(this.props.NowPage + 1);
		}
	},
	prvePage:function(){
		if(this.props.NowPage > 1){
			this.props.onQueryGridData(this.props.NowPage - 1);
		}
	},
	jumpPage:function(){

	},
	render:function(){

		var setAddButton = null,setDeleteButton=null;
		if(this.props.showAdd){
			setAddButton = <button className="btn-link text-success"
			                type="button"
			                onClick={this.props.InsertType}>
			            	<i className="fa-plus-circle"></i> 新增
			        		</button>;			        		
		}

		if(this.props.showDelete){
			setDeleteButton = 	<button className="btn-link text-danger" type="button"
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
			    <small className="pull-right">第{this.props.StartCount}-{this.props.EndCount}筆，共{this.props.RecordCount}筆</small>

			    <ul className="pager">
			        <li>
			            <a href="#" title="移至第一頁" tabIndex="-1" onClick={this.firstPage}>
			                <i className="fa-angle-double-left"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="上一頁" tabIndex="-1" onClick={this.prvePage}>
			                <i className="fa-angle-left"></i>
			            </a>
			        </li> { } 
			        <li className="form-inline">
			            <div className="form-group">
			                <label>第</label>
			                {' '}
			                <input className="form-control text-center" type="number" min="1" tabIndex="-1" value={this.props.NowPage}
			                       onChange={this.jumpPage} />
			                {' '}
			                <label>頁，共{this.props.TotalPage}頁</label>
			            </div>
			        </li> { } 
			        <li>
			            <a href="#" title="@Resources.Res.NextPage" tabIndex="-1" onClick={this.nextPage}>
			                <i className="fa-angle-right"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="移至最後一頁" tabIndex="-1" onClick={this.lastPage}>
			                <i className="fa-angle-double-right"></i>
			            </a>
			        </li>
			    </ul>
			</div>
		);

		return oper;
	}
});

var GridNavPageOnlyView = React.createClass({
	getInitialState: function() {  
		return {
		};  
	},
	firstPage:function(){
		this.props.onQueryGridData(1);
	},
	lastPage:function(){
		this.props.onQueryGridData(this.props.TotalPage);
	},
	nextPage:function(){
		if(this.props.NowPage < this.props.TotalPage){
			this.props.onQueryGridData(this.props.NowPage + 1);
		}
	},
	prvePage:function(){
		if(this.props.NowPage > 1){
			this.props.onQueryGridData(this.props.NowPage - 1);
		}
	},
	jumpPage:function(){

	},
	render:function(){
		var oper = null;

		oper = (
			<div className="table-footer">
			    <small className="pull-right">第{this.props.StartCount}-{this.props.EndCount}筆，共{this.props.RecordCount}筆</small>

			    <ul className="pager">
			        <li>
			            <a href="#" title="移至第一頁" tabIndex="-1" onClick={this.firstPage}>
			                <i className="fa-angle-double-left"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="上一頁" tabIndex="-1" onClick={this.prvePage}>
			                <i className="fa-angle-left"></i>
			            </a>
			        </li> { } 
			        <li className="form-inline">
			            <div className="form-group">
			                <label>第</label>
			                {' '}
			                <input className="form-control" type="number" min="1" tabIndex="-1" value={this.props.NowPage}
			                       onChange={this.jumpPage} />
			                {' '}
			                <label>頁，共{this.props.TotalPage}頁</label>
			            </div>
			        </li> { } 
			        <li>
			            <a href="#" title="@Resources.Res.NextPage" tabIndex="-1" onClick={this.nextPage}>
			                <i className="fa-angle-right"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="移至最後一頁" tabIndex="-1" onClick={this.lastPage}>
			                <i className="fa-angle-double-right"></i>
			            </a>
			        </li>
			    </ul>
			</div>
		);

		return oper;
	}
});

//新增按鈕為popup window
var GridNavPageUsePopup = React.createClass({
	getInitialState: function() {  
		return {
		};  
	},
	getDefaultProps:function(){
		return{
			gridData:null,
			onQueryGridData:null,
			InsertType:0,
			UpdateType:null,
			deleteSubmit:null,
			showAdd:true,
			showDelete:true
		};
	},
	firstPage:function(){
		this.props.onQueryGridData(1);
	},
	lastPage:function(){
		this.props.onQueryGridData(this.props.TotalPage);
	},
	nextPage:function(){
		if(this.props.NowPage < this.props.TotalPage){
			this.props.onQueryGridData(this.props.NowPage + 1);
		}
	},
	prvePage:function(){
		if(this.props.NowPage > 1){
			this.props.onQueryGridData(this.props.NowPage - 1);
		}
	},
	jumpPage:function(){

	},
	render:function(){

		var setAddButton = null,setDeleteButton=null;
		if(this.props.showAdd){
			setAddButton = <button className="btn-link text-success"
			                type="button"
			                data-toggle="modal"
			                data-target={'#myModal-'+this.props.MainId}
			                onClick={this.props.InsertType}>
			            	<i className="fa-plus-circle"></i> 新增
			        		</button>;			        		
		}

		if(this.props.showDelete){
			setDeleteButton = 	<button className="btn-link text-danger" type="button"
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
			    <small className="pull-right">第{this.props.StartCount}-{this.props.EndCount}筆，共{this.props.RecordCount}筆</small>

			    <ul className="pager">
			        <li>
			            <a href="#" title="移至第一頁" tabIndex="-1" onClick={this.firstPage}>
			                <i className="fa-angle-double-left"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="上一頁" tabIndex="-1" onClick={this.prvePage}>
			                <i className="fa-angle-left"></i>
			            </a>
			        </li> { } 
			        <li className="form-inline">
			            <div className="form-group">
			                <label>第</label>
			                {' '}
			                <input className="form-control" type="number" min="1" tabIndex="-1" value={this.props.NowPage}
			                       onChange={this.jumpPage} />
			                {' '}
			                <label>頁，共{this.props.TotalPage}頁</label>
			            </div>
			        </li> { } 
			        <li>
			            <a href="#" title="@Resources.Res.NextPage" tabIndex="-1" onClick={this.nextPage}>
			                <i className="fa-angle-right"></i>
			            </a>
			        </li> { } 
			        <li>
			            <a href="#" title="移至最後一頁" tabIndex="-1" onClick={this.lastPage}>
			                <i className="fa-angle-double-right"></i>
			            </a>
			        </li>
			    </ul>
			</div>
		);

		return oper;
	}
});

//日期輸入元件
var InputDate = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
		};  
	},
	getDefaultProps:function(){
		return{	
			value:null,
			onChange:null,
			field_name:null,
			required:false,
			disabled:false
		};
	},
	componentDidMount:function(){
		$('#' + this.props.id).datetimepicker(
			{
				format:'YYYY-MM-DD',
				icons: {
					previous: "fa-angle-left",
	                next: "fa-angle-right"
				}
			}).on('dp.change',function(e){
				this.props.onChange(this.props.field_name,e);
			}.bind(this));
	},
	componentDidUpdate:function(prevProps, prevState){
	},
	componentWillUnmount:function(){
	},
	onChange:function(e){
		this.props.onChange(this.props.field_name,e);
	},
	render:function(){

		return (
			<div>
				<input 
					type="date" 
					className="form-control datetimepicker"
					id={this.props.id}
					name={this.props.field_name}
					value={this.props.value!=undefined ? moment(this.props.value).format('YYYY-MM-DD'):''}
					onChange={this.onChange}
					required={this.props.required}
					disabled={this.props.disabled} />
					<i className="fa-calendar form-control-feedback"></i>
			</div>
			);
		}
});

//Image共用元件 前台用
var ImgList = React.createClass({
	getInitialState: function() {  
		return { 
		};  
	},
	getDefaultProps:function(){
		//預設值
		return{	
			SetClass:null,
			NoImagePath:gb_approot + 'Content/images/Activities/no_pic.jpg'
		};
	},
	render:function(){	
		
		if(this.props.imgsrc!=undefined){
			return <img src={this.props.imgsrc} className={this.props.SetClass} />;
		}else{
			return <img src={this.props.NoImagePath} className={this.props.SetClass} />;
		}
	}
});

//後端文件上下傳
var MasterDocFileUpload = React.createClass({
	getInitialState: function() {  
		return {
			filelist:[],
			download_src:null
		};  
	},
	getDefaultProps:function(){
		return{	
			url_upload:null,
			url_list:null,
			url_delete:null,
			url_download:null,
			FileKind:null,
			MainId:0
		};
	},
	componentDidUpdate:function(prevProps, prevState){
		//this.getFileList();
	},
	componentDidMount:function(){
		if(this.props.MainId>1){
			this.createFileUpLoadObject();
			this.getFileList();
		}
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	changeFDValue:function(name,e){
		this.props.SetSubInputValue(this.props.ikey,name,e);
	},
	deleteFile:function(filename){
		jqPost(this.props.url_delete,{
			id:this.props.MainId,
			fileKind:this.props.FileKind,
			filename:filename
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.getFileList();
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	getFileList:function(){
		jqPost(this.props.url_list,{
			id:this.props.MainId,
			fileKind:this.props.FileKind
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.setState({filelist:data.filesObject})
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	downloadFile:function(id,filekind,filename){
		var parms = [];
		parms.push('id=' + id);
		parms.push('filekind=' + filekind);
		parms.push('filename=' + filename);
		parms.push('tid=' + uniqid());
		var src = this.props.url_download + '?' + parms.join('&');
		this.setState({download_src:src});
	},
	createFileUpLoadObject:function(){
			var btn = document.getElementById('upload-btn-' + this.props.MainId);
			var r_this = this;
		  	var uploader = new ss.SimpleUpload({
		        button: btn,
		        url: this.props.url_upload,
		        data:{
		        	id:this.props.MainId,
		        	fileKind:this.props.FileKind
		        },
		        name: 'fileName',
		        multiple: true,
		        maxSize: 5000,
		        allowedExtensions: ['pdf', 'doc', 'docx','xls','xlsx','txt','png'],
		        responseType: 'json',
				onSubmit: function(filename, ext) {            
					if(r_this.props.MainId==0){
						alert('此筆資料未完成新增，無法上傳檔案!')
						return false;
					}

					btn.value = ''; 

				},
				onProgress:function(pct){
					console.log('Progress',pct);
				},		
				onSizeError: function() {
		                errBox.innerHTML = 'Files may not exceed 500K.';
				},
				onExtError: function() {
		              errBox.innerHTML = 'Invalid file type. Please select a PNG, JPG, GIF image.';
				},
		        onComplete: function(file, response) {
		        	if(response.result){ 
						r_this.getFileList();
					}else{

					}
		        }
			});
	},
	render: function() {

		var outHtml = null;

		outHtml=(				
		<div>
			<div className="form-control">
				<input type="file" id={'upload-btn-' + this.props.MainId} />
			</div>
			<p className="help-block">
			{
				this.state.filelist.map(function(itemData,i) {
					var  subOutHtml =
					<span className="doc-upload" key={i}>
						<i className="fa-file-text-o"></i>
						<button type="button" className="close" onClick={this.deleteFile.bind(this,itemData.FileName)}>&times;</button>
						<button type="button" className="btn-link" onClick={this.downloadFile.bind(this,this.props.MainId,this.props.FileKind,itemData.FileName)}>
						{itemData.FileName}
						</button>
					</span>;
					return subOutHtml;
				},this)
			}
			</p>
			<iframe src={this.state.download_src} style={ {visibility:'hidden',display:'none'} } />
		</div>
		);
		return outHtml;
	}
});

var MasterDocFileUploadView = React.createClass({
	getInitialState: function() {  
		return {
			filelist:[],
			download_src:null
		};  
	},
	getDefaultProps:function(){
		return{	
			url_upload:null,
			url_list:null,
			url_delete:null,
			url_download:null,
			FileKind:null,
			MainId:0
		};
	},
	componentDidUpdate:function(prevProps, prevState){
		//this.getFileList();
	},
	componentDidMount:function(){
		if(this.props.MainId>1){
			this.getFileList();
		}
	},
	componentWillReceiveProps:function(nextProps){
		
	},
	changeFDValue:function(name,e){
		this.props.SetSubInputValue(this.props.ikey,name,e);
	},
	getFileList:function(){
		jqPost(this.props.url_list,{
			id:this.props.MainId,
			fileKind:this.props.FileKind
		})			
		.done(function(data, textStatus, jqXHRdata) {
			if(data.result){
				this.setState({filelist:data.filesObject})
			}else{
				alert(data.message);
			}
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
	},
	downloadFile:function(id,filekind,filename){
		var parms = [];
		parms.push('id=' + id);
		parms.push('filekind=' + filekind);
		parms.push('filename=' + filename);
		parms.push('tid=' + uniqid());
		var src = this.props.url_download + '?' + parms.join('&');
		this.setState({download_src:src});
	},
	render: function() {

		var outHtml = null;

		outHtml=(				
		<div>
			<p className="help-block">
			{
				this.state.filelist.map(function(itemData,i) {
					var  subOutHtml =
					<span className="doc-upload" key={i}>
						<i className="fa-file-text-o"></i>
						<button type="button" className="btn-link" onClick={this.downloadFile.bind(this,this.props.MainId,this.props.FileKind,itemData.FileName)}>
						{itemData.FileName}
						</button>
					</span>;
					return subOutHtml;
				},this)
			}
			</p>
			<iframe src={this.state.download_src} style={ {visibility:'hidden',display:'none'} } />
		</div>
		);
		return outHtml;
	}
});

//台灣地址切換
var TwAddress = React.createClass({
	getInitialState: function() {  
		return {
			country_list:[]
		};  
	},
	getDefaultProps:function(){
		return{	
			onChange:null,
			zip_value:null,zip_field:null,
			city_value:null,city_field:null,
			country_value:null,country_field:null,
			address_value:null,address_field:null,
			setFDValue:null,
			ver:1,
			label_name:'地址',
			disabled:false
		};
	},
	componentDidMount:function(){
		if(this.props.city_value != null ){
			//console.log('componentDidMount','city_value');
			this.listCountry(this.props.city_value);
		}
	},
	componentDidUpdate:function(prevProps, prevState){
		if(this.props.city_value != null  && this.props.city_value != prevProps.city_value){
			this.listCountry(this.props.city_value);
		}
	},	
	onCityChange:function(e){
		this.props.onChange(this.props.city_field,e);
		this.listCountry(e.target.value);
	},
	onCountryChange:function(e){
		this.props.onChange(this.props.country_field,e);
		for(var i in this.state.country_list){
			var item = this.state.country_list[i];
			if(item.county==e.target.value){
				this.props.setFDValue(this.props.zip_field,item.zip);
				break;
			}
		}
	},
	listCountry:function(value){

		if(value==null || value==undefined || value==''){
			this.setState({country_list:[]});
		}
		else{
			for(var i in CommData.twDistrict){
				var item = CommData.twDistrict[i];
				if(item.city==value){
					this.setState({country_list:item.contain});
					if(this.props.country_value!=null){
						//console.log('country_value');
						//this.setState({a:1});
					}
					//console.log('country value:',this.props.country_value);

					//切換完成預設設為第一個
					//var item_1 = item.contain[0];
					//this.props.setFDValue(this.props.country_field,item_1.county);
					//this.props.setFDValue(this.props.zip_field,item_1.zip);
					break;
				}
			}	
		}


	},
	valueChange:function(f,e){
		this.props.onChange(f,e)
	},
	render: function() {
		var outHtml = null;

		if(this.props.ver==1){
			outHtml=(				
				<div>
					<div className="col-xs-1">
						<input 	type="text" 
								className="form-control"	
								value={this.props.zip_value}
								onChange={this.valueChange.bind(this,this.props.zip_field)}
								maxLength="5"
								required disabled />
					</div>
					<div className="col-xs-2">
						<select className="form-control" 
								value={this.props.city_value}
								onChange={this.onCityChange}
								disabled={this.props.disabled}>
								<option value=""></option>
								{
									CommData.twDistrict.map(function(itemData,i) {
										return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
									})
								}
						</select>
					</div>
					<div className="col-xs-2">
						<select className="form-control" 
								value={this.props.country_value}
								onChange={this.onCountryChange}
								disabled={this.props.disabled}>
								<option value=""></option>
								{
									this.state.country_list.map(function(itemData,i) {
										return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
									})
								}
						</select>
					</div>
					<div className="col-xs-3">
						<input 	type="text" 
								className="form-control"	
								value={this.props.address_value}
								onChange={this.valueChange.bind(this,this.props.address_field)}
								maxLength="128"
								disabled={this.props.disabled} />
					</div>
				</div>
			);
			return outHtml;
		}

		if(this.props.ver==2){
			outHtml=(
			<div>
				<div className="form-group">
						<label for="" className="control-label col-xs-2 text-danger">{this.props.label_name}</label>
						<div className="col-xs-3">
							<input 	type="text" 
									className="form-control"	
									value={this.props.zip_value}
									onChange={this.valueChange.bind(this,this.props.zip_field)}
									maxLength="5"
									required={this.props.required}
									disabled />
						</div>
						<div className="col-xs-3">
							<select className="form-control" 
									value={this.props.city_value}
									onChange={this.onCityChange}
									disabled={this.props.disabled}>
									<option value=""></option>
									{
										CommData.twDistrict.map(function(itemData,i) {
											return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
										})
									}
							</select>
						</div>
						<div className="col-xs-4">
							<select className="form-control" 
									value={this.props.country_value}
									onChange={this.onCountryChange}
									disabled={this.props.disabled}>
									<option value=""></option>
									{
										this.state.country_list.map(function(itemData,i) {
											return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
										})
									}
							</select>
						</div>
				</div>
				<div className="form-group">
			        <div className="col-xs-10 col-xs-offset-2">
							<input 	type="text" 
									className="form-control"	
									value={this.props.address_value}
									onChange={this.valueChange.bind(this,this.props.address_field)}
									maxLength="128"
									required={this.props.required}
									disabled={this.props.disabled} />
			        </div>
			    </div>
			</div>
			);

			return outHtml;
		}

		if(this.props.ver==3){
			outHtml=(				
				<div>
					<div className="col-xs-1">
						<input 	type="text" 
								className="form-control"	
								value={this.props.zip_value}
								onChange={this.valueChange.bind(this,this.props.zip_field)}
								maxLength="5"
								required disabled />
					</div>
					<div className="col-xs-2">
						<select className="form-control" 
								value={this.props.city_value}
								onChange={this.onCityChange}
								disabled={this.props.disabled}>
								<option value=""></option>
								{
									CommData.twDistrict.map(function(itemData,i) {
										return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
									})
								}
						</select>
					</div>
					<div className="col-xs-2">
						<select className="form-control" 
								value={this.props.country_value}
								onChange={this.onCountryChange}
								disabled={this.props.disabled}>
								<option value=""></option>
								{
									this.state.country_list.map(function(itemData,i) {
										return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
									})
								}
						</select>
					</div>
					<div className="col-xs-4">
						<input 	type="text" 
								className="form-control"	
								value={this.props.address_value}
								onChange={this.valueChange.bind(this,this.props.address_field)}
								maxLength="128"
								disabled={this.props.disabled} />
					</div>
				</div>
			);
			return outHtml;
		}
	}
});


var ModalQueryProduct = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getDefaultProps:function(){
		return{	
			defaultShowModal:false,
			dataOption:[],
			idValue:0,
			idField:'product_id',
			labelField:'product_name',
			setValue:null,
			index: -1,
			disabled:false,
			defaultLabel:null
		};
	},
	getInitialState: function() {  
		return {
			isShowModal:this.props.defaultShowModal,
			label:null
		};  
	},
	componentWillMount:function(){
		console.log('ModalQueryProduct componentWillMount',this.props.idValue);
		if(this.props.idValue > 0){
			for(var i in this.props.dataOption){
				var item = this.props.dataOption[i];
				if(item[this.props.idField]==this.props.idValue){
					this.setState({label:item[this.props.labelField]});
				}
			}
		}
	},	
	componentDidMount:function(){
		//console.log('componentDidMount',this.props.idValue);
	},
	componentDidUpdate:function(prevProps, prevState){
		console.log('ModalQueryProduct componentDidUpdate',this.props.defaultLabel)
		if(prevProps.idValue!=this.props.idValue && prevProps.idValue>0){
			this.setState({label:this.props.defaultLabel});
		}
	},
	close:function(){
		this.setState({isShow:false});
	},
	open:function(){
		this.setState({isShow:true});
	},
	setValue:function(id,e){
		for(var i in this.props.dataOption){
			var item = this.props.dataOption[i];
			if(item[this.props.idField]==id){
				this.setState({label:item[this.props.labelField],isShow:false});
				this.props.setValue(item,this.props.index);
			}
		}
	},
	render:function(){

 		var Modal = ReactBootstrap.Modal;
 		var Button = ReactBootstrap.Button;

		var outHtml = null;
		var sub_out_html = null;
		if(this.state.isShow){
			sub_out_html = (
				<Modal title="選擇產品" onRequestHide={this.close}>
						<div className='modal-body'>
							<table>
								<tbody>
								<tr>
									<th>產品編號</th>
									<th>產品名稱</th>
								</tr>
								{
									this.props.dataOption.map(function(itemData,i) {
										
										var out_sub_html = 
											<tr key={itemData[this.props.idField]}>
												<td>{itemData.product_sn}</td>
												<td>

													<button type="button" onClick={this.setValue.bind(this,itemData[this.props.idField])} className="btn-success">
														<i className="fa-plus-circle"></i> { } {itemData[this.props.labelField]}
													</button>
												</td>
											</tr>;
										return out_sub_html;
									}.bind(this))
								}
								</tbody>
							</table>
						</div>
						<div className='modal-footer'>
							<Button onClick={this.close}><i className="fa-times"></i> { } 關閉視窗</Button>
						</div>
				</Modal>
				);
		}
		else
		{
			sub_out_html = null;
		}

		var out_button = null;
		if(this.props.idValue==0){
			out_button = 
			<button type="button" className="btn-link" onClick={this.open} disabled={this.props.disabled}>
				按此選擇產品...
			</button>;
		}
		else{
			out_button = 
			<button type="button" className="btn-success" onClick={this.open} disabled={this.props.disabled}>
				{this.state.label}
			</button>;
		}

		outHtml = (
			<div>
				{out_button} 
				{sub_out_html}
			</div>
			);

		return outHtml;
	}
});

var ModalQueryCustomer = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getDefaultProps:function(){
		return{	
			defaultShowModal:false,
			defaultLabel:null,
			idValue:0,
			idField:'customer_id',
			labelField:'customer_name',
			setValue:null,
			index: -1,
			disabled:false
		};
	},
	getInitialState: function() {  
		return {
			isShowModal:this.props.defaultShowModal,
			label:null,
			dataOption:[],
			queryObj:{
				city:null,
				country:null,
				word:null
			},
			country_list:[]
		};  
	},
	componentWillMount:function(){
		if(this.props.defaultLabel!=null){
			this.setState({label:this.props.defaultLabel});
		}
	},	
	componentDidMount:function(){

	},
	componentDidUpdate:function(prevProps, prevState){
		if(prevProps.idValue!=this.props.idValue && prevProps.idValue>0){
			this.setState({label:this.props.defaultLabel});
		}
	},
	submitSearch:function(e){
		e.preventDefault();
		//console.log(e,this.state.queryObj);

		jqGet(gb_approot + 'api/GetAction/GetAllCustomer',this.state.queryObj)
		.done(function(data, textStatus, jqXHRdata) {
			console.log(data);
			this.setState({dataOption:data});
		}.bind(this))
		.fail(function( jqXHR, textStatus, errorThrown ) {
			showAjaxError(errorThrown);
		});
		return;
	},
	close:function(){
		this.setState({isShow:false});
	},
	open:function(){
		this.setState({isShow:true});
	},
	setValue:function(id,e){
		//console.log(id);
		for(var i in this.state.dataOption){
			var item = this.state.dataOption[i];
			if(item[this.props.idField]==id){
				this.setState({label:item[this.props.labelField],isShow:false});
				this.props.setValue(item,this.props.index);
			}
		}
	},
	onCityChange:function(e){

		this.listCountry(e.target.value);
		var obj = this.state.queryObj;
		obj['city'] = e.target.value;
		this.setState({queryObj:obj});
	},
	onCountryChange:function(e){
		var obj = this.state.queryObj;
		obj['country'] = e.target.value;
		this.setState({queryObj:obj});
	},
	changeWordValue:function(e){
		var obj = this.state.queryObj;
		obj['word'] = e.target.value;
		this.setState({queryObj:obj});
	},
	listCountry:function(value){
		for(var i in CommData.twDistrict){
			var item = CommData.twDistrict[i];
			if(item.city==value){
				this.setState({country_list:item.contain});
				break;
			}
		}
	},
	render:function(){

 		var Modal = ReactBootstrap.Modal;
 		var Button = ReactBootstrap.Button;

		var outHtml = null;
		var sub_out_html = null;
		if(this.state.isShow){
			sub_out_html = (
				<Modal title="選擇客戶" onRequestHide={this.close}>
						<div className='modal-body'>
							<form onSubmit={this.submitSearch}>
								<div className="table-header">
									<div className="table-filter">
										<div className="form-inline">
											<div className="form-group">
												<label className="sr-only">縣市</label>
												<select className="form-control" 
													value={this.state.queryObj.city}
													onChange={this.onCityChange}
													>
													<option value="">選擇縣市</option>
													{
														CommData.twDistrict.map(function(itemData,i) {
															return <option key={itemData.city} value={itemData.city}>{itemData.city}</option>;
														})
													}
												</select>
												{ } <label className="sr-only">鄉鎮</label>{ } 
												<select className="form-control" 
														value={this.state.queryObj.country}
														onChange={this.onCountryChange}>
														<option value="">選擇鄉鎮</option>
														{
															this.state.country_list.map(function(itemData,i) {
																return <option key={itemData.county} value={itemData.county}>{itemData.county}</option>;
															})
														}
												</select>
												{ } <label className="sr-only">客編</label>{ } 
												<input type="text" 
													className="form-control"	
													value={this.state.queryObj.word}
													placeholder="客編/名稱"
													onChange={this.changeWordValue}
													 />
												{ } <button className="btn-primary" type="submit"><i className="fa-search"></i> { } 查詢</button>
											</div>
										</div>
									</div>
								</div>
							</form>
							<table>
								<tbody>
									<tr>
										<th>客戶編號</th>
										<th>客戶名稱</th>
									</tr>
									{
										this.state.dataOption.map(function(itemData,i) {
											
											var out_sub_html = 
												<tr key={itemData[this.props.idField]}>
													<td>{itemData.customer_sn}</td>
													<td>
														<button type="button" onClick={this.setValue.bind(this,itemData[this.props.idField])} className="btn-success">
															<i className="fa-plus-circle"></i> {itemData[this.props.labelField]}
														</button>
													</td>
												</tr>;
											return out_sub_html;
										}.bind(this))
									}
								</tbody>
							</table>
						</div>
						<div className='modal-footer'>
							<Button onClick={this.close}><i className="fa-times"></i> { } 關閉視窗</Button>
						</div>
				</Modal>
				);
		}
		else
		{
			sub_out_html = null;
		}

		var out_button = null;
		if(this.props.idValue==0){
			out_button = 
			<button type="button" className="btn-link" onClick={this.open} disabled={this.props.disabled}>
				按此選擇客戶...
			</button>;
		}
		else{
			out_button = 
			<button type="button" className="btn-success" onClick={this.open} disabled={this.props.disabled}>
				{this.state.label}
			</button>;
		}

		outHtml = (
			<div>
				{out_button} 
				{sub_out_html}
			</div>
			);

		return outHtml;
	}
});

var StateForGrid = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			setClass:null,
			label:null
		};  
	},
	getDefaultProps:function(){
		return{	
			stateData:null,
			id:null
		};
	},
    componentWillReceiveProps:function(nextProps){
        //當元件收到新的 props 時被執行，這個方法在初始化時並不會被執行。使用的時機是在我們使用 setState() 並且呼叫 render() 之前您可以比對 props，舊的值在 this.props，而新值就從 nextProps 來。
    	for(var i in this.props.stateData){
			var item = this.props.stateData[i];
			if(item.id==nextProps.id){
				this.setState({setClass:item.className,label:item.label});
				break;
			}
		}
    },
	componentDidMount:function(){
		for(var i in this.props.stateData){
			var item = this.props.stateData[i];
			if(item.id==this.props.id){
				this.setState({setClass:item.className,label:item.label});
				break;
			}
		}
	},
	render:function(){
		return (
				<span className={this.state.setClass}>
					{this.state.label}
				</span>
			);
		}
});

var IdForGrid = React.createClass({
	mixins: [React.addons.LinkedStateMixin], 
	getInitialState: function() {  
		return { 
			label:null
		};  
	},
	getDefaultProps:function(){
		return{	
			idData:null,
			id:null
		};
	},
	componentDidMount:function(){
		for(var i in this.props.idData){
			var item = this.props.idData[i];
			if(item.id==this.props.id){
				this.setState({label:item.label});
				break;
			}
		}
	},
	render:function(){
		return (
				<span>
					{this.state.label}
				</span>
			);
		}
});