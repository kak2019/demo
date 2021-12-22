import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ButtonClickedCallback, ICountryListItem } from '../../models';
export interface IHelloWorldWebPartProps {
  description: string;
  onAddListItem?: ButtonClickedCallback;
  onUpdateListItem?: ButtonClickedCallback;
  onDeleteListItem?: ButtonClickedCallback;
  
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private _countries: ICountryListItem[];
    
  public render(): void {
    const element: React.ReactElement<IHelloWorldProps> = React.createElement(
      HelloWorld,
      {
        spListItems: this._countries,
        onGetListItems: this._onGetListItems,
        onAddListItem: this._onAddListItem,
        onUpdateListItem: this._onUpdateListItem,
        onDeleteListItem: this._onDeleteListItem,
        
      }
      
    );

    ReactDom.render(element, this.domElement);
    
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  
  
  private _onUpdateListItem = (): void => {
    this._updateListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }
  private _onAddListItem = (): void => {
    this._addListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }
  
  private _onDeleteListItem = (): void => {
    this._deleteListItem()
      .then(() => {
        this._getListItems()
          .then(response => {
            this._countries = response;
            this.render();
          });
      });
  }
  private _getItemEntityType(): Promise<string> {
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.ListItemEntityTypeFullName;
      }) as Promise<string>;
  }
  
  private async _addListItem(): Promise<SPHttpClientResponse> {
    const spEntityType = await this._getItemEntityType();
    const request: any = {};
    request.body = JSON.stringify({
      Title: new Date().toUTCString(),
      '@odata.type': spEntityType
    });
    return await this.context.spHttpClient.post(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items`,
      SPHttpClient.configurations.v1,
      request);
  }
  private _updateListItem(): Promise<SPHttpClientResponse> {
    // get the first item
    return this.context.spHttpClient.get(
        this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title&$filter=Title eq 'China'`,
        SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.value[1];
      })
      .then((listItem: ICountryListItem) => {
        // update item
        listItem.Title = 'USA';
        // save it
        const request: any = {};
        request.headers = {
          'X-HTTP-Method': 'MERGE',
          'IF-MATCH': (listItem as any)['@odata.etag']
        };
        request.body = JSON.stringify(listItem);
  
        return this.context.spHttpClient.post(
          this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items(${listItem.Id})`,
          SPHttpClient.configurations.v1,
          request);
      });
  }
  private async _deleteListItem(): Promise<SPHttpClientResponse> {
    // get the last item
    const response = await this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title&$orderby=ID asc&$top=1`,
      SPHttpClient.configurations.v1);
    const jsonResponse = await response.json();
    const listItem = jsonResponse.value[5];
    const request: any = {};
    request.headers = {
      'X-HTTP-Method': 'DELETE',
      'IF-MATCH': '*'
    };
    request.body = JSON.stringify(listItem);
    return await this.context.spHttpClient.post(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items(${listItem.Id})`,
      SPHttpClient.configurations.v1,
      request);
  }
  
 
  private _getListItems(): Promise<ICountryListItem[]> {
    return this.context.spHttpClient.get(
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getbytitle('Countries')/items?$select=Id,Title`,
      SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        return jsonResponse.value;
      }) as Promise<ICountryListItem[]>;
  }
   private _onGetListItems = (): void => {
    this._getListItems()
      .then(response => {
        this._countries = response;
        this.render();
      });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
