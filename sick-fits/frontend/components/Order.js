import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';

import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderItem from './OrderItem';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Query
        query={SINGLE_ORDER_QUERY}
        variables={{ id: this.props.id }}
      >
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>

          const order = data.order;
          return (
            <OrderStyles>
              <Head>
                <title>Sick Fits - Order {order.id} </title>
              </Head>

              <p><span>Order Id:</span> <span>{this.props.id}</span></p>
              <p><span>Charge:</span> <span>{order.charge}</span></p>
              <p><span>Date:</span> <span>{format(order.createdAt, 'MMMM d, YYYY, h:mm a')}</span></p>
              <p><span>Order Total:</span> <span>{formatMoney(order.total)}</span></p>
              <p><span>Item Count:</span> <span>{order.items.length}</span></p>

              <div className="items">
                {order.items.map(item => <OrderItem key={item.id} item={item} />)}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;