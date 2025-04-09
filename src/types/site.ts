export interface ImageThumbnail {
	url: string,
	width: number,
	height: number,
}

export interface Image {
	url: string,
	width: number,
	height: number,
	thumbnails?: ImageThumbnail[],
	alternateText?: string,
}

export interface C_footerTabs {
	text?: string,
	uRL?: string,
}

export default interface Ce_site {
	name: string,
	c_footer?: Image,
	c_footerTabs?: C_footerTabs[],
	c_header?: Image,
	c_lRCDate?: string,
	id: string,
}
