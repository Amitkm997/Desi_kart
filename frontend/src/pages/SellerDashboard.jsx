import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaUsers, FaChartLine } from 'react-icons/fa';
import Meta from '../components/Meta';

const SellerDashboard = () => {
  const { sellerInfo } = useSelector(state => state.sellerAuth);

  return (
    <Container className='mt-5 pt-5'>
      <Meta title={'Seller Dashboard'} />
      <Row>
        <Col>
          <h1>Seller Dashboard</h1>
          <p className='text-muted'>
            Welcome back, {sellerInfo?.name}! Manage your products and orders here.
          </p>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col md={3} className='mb-3'>
          <Card className='text-center h-100'>
            <Card.Body>
              <FaBox className='text-primary mb-3' size={40} />
              <Card.Title>Products</Card.Title>
              <Card.Text className='h2 text-primary'>0</Card.Text>
              <Button variant='outline-primary' as={Link} to='/seller/products'>
                Manage Products
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='text-center h-100'>
            <Card.Body>
              <FaShoppingCart className='text-success mb-3' size={40} />
              <Card.Title>Orders</Card.Title>
              <Card.Text className='h2 text-success'>0</Card.Text>
              <Button variant='outline-success' as={Link} to='/seller/orders'>
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='text-center h-100'>
            <Card.Body>
              <FaUsers className='text-info mb-3' size={40} />
              <Card.Title>Customers</Card.Title>
              <Card.Text className='h2 text-info'>0</Card.Text>
              <Button variant='outline-info' as={Link} to='/seller/customers'>
                View Customers
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className='mb-3'>
          <Card className='text-center h-100'>
            <Card.Body>
              <FaChartLine className='text-warning mb-3' size={40} />
              <Card.Title>Revenue</Card.Title>
              <Card.Text className='h2 text-warning'>₹0</Card.Text>
              <Button variant='outline-warning' as={Link} to='/seller/analytics'>
                View Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mt-4'>
        <Col md={6} className='mb-3'>
          <Card>
            <Card.Header>
              <h5>Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              <p className='text-muted'>No recent orders</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className='mb-3'>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className='d-grid gap-2'>
                <Button variant='primary' as={Link} to='/seller/products/add'>
                  Add New Product
                </Button>
                <Button variant='outline-secondary' as={Link} to='/seller/profile'>
                  Update Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SellerDashboard; 