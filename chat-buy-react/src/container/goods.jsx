import React from 'react';
import {connect} from 'react-redux';
import {getGoodsInfo, addToCart, buy} from '../actions/goods';
import GoodsList from '../components/goods/goodsList';
import Buy from '../components/goods/buy';

@connect (state => state.goods, {getGoodsInfo, addToCart, buy})
class Goods extends React.Component {
  constructor () {
    super ();
    this.handleBuy = this.handleBuy.bind (this);
  }
  componentDidMount () {
    if (!this.props.goodsList.length) {
      this.props.getGoodsInfo ();
    }
  }
  handleBuy () {
    this.props.buy ();
  }
  render () {
    return (
      <div className="list">
        <GoodsList
          goodsList={this.props.goodsList}
          addToCart={this.props.addToCart}
          shopCart={this.props.shopCart}
        />
        <Buy price={this.props.totalPrice} handleBuy={this.handleBuy} />
      </div>
    );
  }
}

export default Goods;
