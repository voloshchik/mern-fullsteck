import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const AuthPage = () => {
  const message = useMessage();
  const { request, loading, error, clearError } = useHttp();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHadler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHadler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
      console.log('data', data);
    } catch (error) {}
  };
  const loginHadler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      message(data.message);
      console.log('data', data);
    } catch (error) {}
  };
  return (
    <div className='row'>
      <div className='col s6 offset-s3'>
        <h2>Сократи Ссылку</h2>
        <div className='card blue darken-1'>
          <div className='card-content white-text'>
            <span className='card-title'>Авоторизация</span>
            <div>
              <div className='input-field '>
                <input
                  className='yellow-input'
                  id='email'
                  placeholder='Введите email'
                  type='text'
                  name='email'
                  onChange={changeHadler}
                />
                <label htmlFor='email'>Email</label>
              </div>
              <div className='input-field '>
                <input
                  className='yellow-input'
                  id='password'
                  placeholder='Введите пароль'
                  type='password'
                  name='password'
                  onChange={changeHadler}
                />
                <label htmlFor='password'>Password</label>
              </div>
            </div>
          </div>
          <div className='card-action'>
            <button
              disabled={loading}
              onClick={loginHadler}
              className='bnt yellow darken-4'
              style={{ marginRight: 10 }}
            >
              Войти
            </button>
            <button
              disabled={loading}
              onClick={registerHadler}
              className='bnt gray lighten-1 black-text'
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
