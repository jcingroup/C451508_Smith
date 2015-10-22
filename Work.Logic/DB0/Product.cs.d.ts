declare module server {
	interface Product extends BaseEntityTable {
		product_id: number;
		product_type: number;
		product_name: string;
		price: number;
		standard: string;
		sort: number;
		memo: string;
		i_Hide: boolean;
		i_InsertUserID: string;
		i_InsertDeptID: number;
		i_InsertDateTime: Date;
		i_UpdateUserID: string;
		i_UpdateDeptID: number;
		i_UpdateDateTime: Date;
		i_Lang: string;
	}
	interface QueryBase {
		page: number;
	}
	interface SNObject {
		y: number;
		m: number;
		d: number;
		w: number;
		sn_max: number;
	}
	interface BaseEntityTable {
		edit_type: number;
		check_del: boolean;
	}
}
