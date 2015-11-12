declare module server {
	interface News extends BaseEntityTable {
		news_id: number;
		is_correspond: boolean;
		news_title: string;
		news_content: string;
		news_date: Date;
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
