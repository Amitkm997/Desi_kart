import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterSellerMutation } from '../slices/sellersApiSlice';
import { setSellerCredentials } from '../slices/sellerAuthSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const SellerRegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerSeller, { isLoading }] = useRegisterSellerMutation();

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
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const submitHandler = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    } else {
      try {
        const res = await registerSeller({ name, email, password }).unwrap();
        dispatch(setSellerCredentials({ ...res }));
        navigate(redirect);
        toast.success('Seller registration successful. Welcome!');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <FormContainer>
      <Meta title={'Seller Register'} />
      <h1>Seller Registration</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Business Name</Form.Label>
          <Form.Control
            value={name}
            type='text'
            placeholder='Enter business name'
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Group>
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
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder='Confirm password'
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <InputGroup.Text
              onClick={toggleConfirmPasswordVisibility}
              id='toggleConfirmPasswordVisibility'
              style={{ cursor: 'pointer' }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button
          className='mb-3 w-100'
          variant='warning'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : 'Register as Seller'}
        </Button>
      </Form>
      <Row>
        <Col>
          Already have a seller account?
          <Link
            to={redirect ? `/seller/login?redirect=${redirect}` : '/seller/login'}
            className=' mx-2'
          >
            Sign In
          </Link>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col>
          Want to shop instead?
          <Link to='/register' className=' mx-2'>
            Register as Customer
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default SellerRegisterPage; 