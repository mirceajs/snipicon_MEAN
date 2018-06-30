/* tslint:disable */

declare var Object: any;
export interface SIconInterface {
  "id"?: string;
  "name": string;
  "contentHash"?: number;
  "firstRegId"?: string;
  "url"?: string;
  "tags"?: Array<any>;
  "sourceSIconId"?: number;
  "iconState": string;
  "graphicsType": string;
  "data": string;
  "userId"?: string;
  "created"?: Date;
  "modified"?: Date;
  "vaultId"?: number;
  user?: any;
}

export class SIcon implements SIconInterface {
  "id": string;
  "name": string;
  "contentHash": number;
  "firstRegId": string;
  "url": string;
  "tags": Array<any>;
  "sourceSIconId": number;
  "iconState": string;
  "graphicsType": string;
  "data": string;
  "userId": string;
  "created": Date;
  "modified": Date;
  "vaultId": number;
  user: any;
  constructor(data?: SIconInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `SIcon`.
   */
  public static getModelName() {
    return "SIcon";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of SIcon for dynamic purposes.
  **/
  public static factory(data: SIconInterface): SIcon{
    return new SIcon(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'SIcon',
      plural: 'SIcons',
      path: 'SIcons',
      properties: {
        "id": {
          name: 'id',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "contentHash": {
          name: 'contentHash',
          type: 'number'
        },
        "firstRegId": {
          name: 'firstRegId',
          type: 'string'
        },
        "url": {
          name: 'url',
          type: 'string'
        },
        "tags": {
          name: 'tags',
          type: 'Array&lt;any&gt;'
        },
        "sourceSIconId": {
          name: 'sourceSIconId',
          type: 'number'
        },
        "iconState": {
          name: 'iconState',
          type: 'string'
        },
        "graphicsType": {
          name: 'graphicsType',
          type: 'string'
        },
        "data": {
          name: 'data',
          type: 'string'
        },
        "userId": {
          name: 'userId',
          type: 'string'
        },
        "created": {
          name: 'created',
          type: 'Date'
        },
        "modified": {
          name: 'modified',
          type: 'Date'
        },
        "vaultId": {
          name: 'vaultId',
          type: 'number'
        },
      },
      relations: {
        user: {
          name: 'user',
          type: 'any',
          model: ''
        },
      }
    }
  }
}
