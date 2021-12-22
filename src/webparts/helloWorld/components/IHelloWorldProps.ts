import {
  ButtonClickedCallback,
  ICountryListItem
} from '../../../models';
export interface IHelloWorldProps {
  spListItems: ICountryListItem[];
  onGetListItems?: ButtonClickedCallback;
  onAddListItem?: ButtonClickedCallback;
onUpdateListItem?: ButtonClickedCallback;
onDeleteListItem?: ButtonClickedCallback;
}
