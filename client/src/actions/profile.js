import axios from 'axios';
// import { setAlert } from './alert';

import {
  GET_PROFILE,
  PROFILE_ERROR
} from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    console.log('try');
    const res = await axios.get('/api/profile/me');
    console.log('res');
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    console.log('haha');
  } catch (err) {
    console.log(err);
    dispatch({
       type: PROFILE_ERROR,
       payload: { msg: err.response, status: err.response.status }
     });
   }
};
