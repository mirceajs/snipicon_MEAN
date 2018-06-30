export interface SIconInterface {
	
	name :string;
	source:string;
	id?:string;
	firstRegId?: string;
	tags?: Array<any>;
	iconState?: string;
    graphicsType: string;
	
}

export class SIcon implements SIconInterface {
    name :string;
	source:string;
	id:string;
	firstRegId: string;
	tags: Array<any>;
	iconState: string;
    graphicsType: string;
  constructor(data?: SIconInterface) {
    Object.assign(this, data);
  }
}