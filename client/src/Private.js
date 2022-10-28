import React from 'react'

const Private = ({ logout, user, pwd }) => {
  return (
    <div>
      <p>/user</p>
      <p>You are allowed to be here, welcome {user + pwd}</p>
      <button className='logout' onClick={logout}>Logout</button>
    </div>
  )
}

export default Private