import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <div id="authentication-callback" className="min-h-[400px]">
      </div>
    </div>
  )
}

export default Callback