import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginSellerMutation } from '../slices/sellersApiSlice';
import { setSellerCredentials } from '../slices/sellerAuthSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const SellerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginSeller, { isLoading }] = useLoginSellerMutation();

  const { sellerInfo } = useSelector(state => state.sellerAuth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/seller/dashboard';

  useEffect(() => {
    if (sellerInfo) {
      navigate(redirect);
    }
  }, [sellerInfo, redirect, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await loginSeller({ email, password }).unwrap();
      dispatch(setSellerCredentials({ ...res }));
      navigate(redirect);
      toast.success('Login successful. Welcome back!');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Seller Login'} />
      <h1>Seller Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            type='email'
            placeholder='Enter email'
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder='Enter password'
              onChange={e => setPassword(e.target.value)}
              required
            />
            <InputGroup.Text
              onClick={togglePasswordVisibility}
              id='togglePasswordVisibility'
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button
          className='mb-3 w-100'
          variant='warning'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Sign In'}
        </Button>
      </Form>
      <Row>
        <Col>
          New Seller?
          <Link
            to={redirect ? `/seller/register?redirect=${redirect}` : '/seller/register'}
            className=' mx-2'
          >
            Register
          </Link>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          Want to shop instead?
          <Link to='/login' className=' mx-2'>
            Customer Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default SellerLoginPage; 