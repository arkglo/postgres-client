import React, { useEffect, useState, Component } from 'react';
import axios from 'axios';
import { apiPath } from '../lib/apiPath'
import Error from './error';
import { ToastContainer, toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";
// import { set } from 'core-js/fn/dict';


const BadPayment = (props) => {
  const [loading, setLoading] = useState(false)
  const [failedOrderDetails, setFailedOrderDetails] = useState(null)

  const drop = cssTransition({
    enter: "animate__animated animate__slideInDown",
    exit: "animate__animated animate__hinge"
  });

  useEffect(() => {
    console.log("BadPayment.componentDidMount()")
    purchaseError(<div><b>Failed to purchase</b></div>);
    informServerOfFailedPurchase();


    //setLoading(true)
    getCheckoutInformation()
  }, [])

  // useEffect(() => {
  //   if(loading) {
  //     getCheckoutInformation()
  //   }
  // }, [loading])

  // useEffect(() => {
  //   setLoading(false)
  // }, [failedOrderDetails])

  const purchaseError = (message, runOnClose) => {
    let toastOptions = {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition:drop
    };
    if( runOnClose !== undefined || runOnClose !== null || runOnClose !== "" ) {
      toastOptions.onClose = runOnClose
    }
    toast.error( message, toastOptions );
  }

  const getSessionId = () => {
    return getQueryVariable("session_id");
  }

  //------------------------------------------------------------
  const informServerOfFailedPurchase = () => {
    // Tell the server that the payment failed and it should cancel the pending order
    axios.put(apiPath('PUT', '/payment/cancel', getSessionId())).then((response) => {
      if (response.status !== 200) {
        purchaseError('Failed to cancel Payment.');
        return console.warn('Failed to cancel Payment.')
      }
      console.log('Payment Canceled!')
    }).catch((error) => {
      Error.message(error.response)
    });
  }
  //------------------------------------------------------------
  const getCheckoutInformation = () => {
    // Tell the server that the payment failed and it should cancel the pending order
    axios.get(apiPath('GET', '/payment/checkout', getSessionId())).then((response) => {
      if (response.status !== 200) {
        purchaseError('Failed to cancel Payment.');
        return console.warn('Failed to cancel Payment.')
      }
      console.log('Payment Canceled!')
debugger
      //response.data
      const billy = JSON.stringify(response.data.data) || null;
      console.log(billy)
      setFailedOrderDetails(billy);


    }).catch((error) => {
      Error.message(error.response)
    });
  }

  const confirmCancelNotification = (event) => {
    //Setup some initial data
    event.preventDefault();  // IMPORTANT.
    const currentLocation = window.location.toString();
    var point = currentLocation.indexOf("/canceled")
    if( point !== -1 )
      window.location = currentLocation.slice(0, point)
    else
      window.location = "http://localhost:3000/billy";
  }

  const getQueryVariable = (variable) => {
    var query = props.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return null;
  }



    // if(loading) {
    //   return (
    //     <div>LOADING...</div>
    //   )
    // }

    console.log("%cPayment - render()", 'color: blue')
    const summaryHeader = <div><div>There seems to be a problem with your purchase, you have <b>not</b> been charged.</div><div>You session number was <b>{getSessionId()}</b></div></div>
    const okButton = <button type="submit" className="btn btn-primary" onClick={confirmCancelNotification} >Ok :-(</button>
  
    // if(failedOrderDetails == null) {
    //   return (
    //     <div>No Data!</div>
    //   )
    // }

  return (
    <div className="panel panel-default">
      <div className="panel-heading">Payment Canceled</div>
      <div className="panel-body">
        {summaryHeader}
        {failedOrderDetails}
        {okButton}
      </div>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </div>
  );

}

export default BadPayment;
