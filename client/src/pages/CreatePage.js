import { useHistory } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from './../context/AuthContext';
export const CreatePage = () => {
  const [link, setLink] = useState('');
  const { request } = useHttp();
  const auth = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  const pressHandler = async (event) => {
    if (event.key === 'Enter') {
      try {
        const data = await request(
          '/api/link/generate',
          'Post',
          { from: link },
          { Authorization: `Bear ${auth.token}` }
        );
        history.push(`/detail/${data.link._id}`);
        console.log('data', data);
      } catch (error) {}
    }
  };
  return (
    <div className='row'>
      <div className='col s8 offset-s2'>
        <div className='input-field  ' style={{ marginTop: '3rem' }}>
          <input
            id='link'
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder='Вставте ссылку'
            type='text'
            onKeyPress={pressHandler}
          />
          <label htmlFor='link'>Введите ссылку</label>
        </div>
      </div>
    </div>
  );
};
