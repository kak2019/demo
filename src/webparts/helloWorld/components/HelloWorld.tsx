import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  private onGetListItemsClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    this.props.onGetListItems();
  }
  private onAddListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    this.props.onAddListItem();
  }

  private onUpdateListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    this.props.onUpdateListItem();
  }

  private onDeleteListItemClicked = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    this.props.onDeleteListItem();
  }
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>

              <a href="#" className={styles.button} onClick={this.onGetListItemsClicked}>
                <span className={styles.label}>Get Counties</span>

                {/* <span className={ styles.label }>Learn more</span> */}
              </a>
              <a href="#" className={styles.button} onClick={this.onAddListItemClicked}>
                <span className={styles.label}>Add List Item</span>
              </a>
              <a href="#" className={styles.button} onClick={this.onUpdateListItemClicked}>
                <span className={styles.label}>Update List Item</span>
              </a>
              <a href="#" className={styles.button} onClick={this.onDeleteListItemClicked}>
                <span className={styles.label}>Delete List Item</span>
              </a>
              
            </div>
            
          </div>
          
          


          <div className={styles.row}>
            <ul className={styles.list}>
              {this.props.spListItems &&
                this.props.spListItems.map((list) =>
                  <li key={list.Id} className={styles.item}>
                    <strong>Id:</strong> {list.Id}, <strong>Title:</strong> {list.Title}
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
