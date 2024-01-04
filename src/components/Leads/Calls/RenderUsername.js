import React, { useEffect, useState } from 'react'
import { userApi } from '../../../apis/userApi';
import { getMethodError } from '../../../constants/errorMessages';
import { Toaster } from '../../../pages/common/Toaster';

const RenderUsername = ({id}) => {

  const [name, setname] = useState('');
  useEffect(() => {
    userApi.getUser(id)

    .then((data) => {
        setname(data?.data?.attributes?.first_name + " " + data?.data?.attributes?.last_name)
    })
    .catch((error) => {
      Toaster.TOAST(getMethodError(error), "error");
      console.log(error);
    });
  }, [])

  return (
    <>{name}</>
  )
}

export default RenderUsername
