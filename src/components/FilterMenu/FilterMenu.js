import React, {Component} from 'react';
import { slide as Menu } from 'react-burger-menu'
import './FilterMenu.css'

/*
  Filter menu component is a generic hamburger menu,
  that show a list of items and a callback when this list is updated
 */
export default class FilterMenu extends Component {

  constructor(props) {
    super(props);

    this.filterList = this.filterList.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  filterList = function (event) {
    let name = event.target.value;

    let updateList = this.props.list;

    this.props.list.forEach(function (item) {
      item.visible = item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
    });

    this.props.updateListCallback(updateList);

  };

  onItemClick = function (event) {
    let item = event.target.innerHTML;
    this.props.itemClicked(item);
  };

  render() {
    return (
      <Menu noOverlay
            width={ '250px' } >
        <h4>{this.props.title}</h4>
        <div id="filter-list-menu">
          <input type="text" placeholder="Filter" onChange={ this.filterList }/>
          <ul>
            {
              this.props.list.map(function(item) {
                return <li key={item.name} className={item.visible ? '' : 'hide'} onClick={this.onItemClick}>{item.name}</li>
              }.bind(this))
            }
          </ul>
        </div>
      </Menu>
    )
  }
}