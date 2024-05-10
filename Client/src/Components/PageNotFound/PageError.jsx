import React from 'react'

import './PageError.css'

import errorimg from '../../Asserts/pagenotfound/pagenotfound.jpg'

export default function PageError() {
  return (
    <>
      <div className="pageerror">
        <img src={errorimg} alt="Page Was Not Found" />
      </div>
    </>
  )
}
