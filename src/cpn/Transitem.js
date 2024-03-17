import React from "react";

export const Transitem =({transactions})=>{

    
    return (
        <React.Fragment>
        {transactions.map(item => (
        <tr key={item.id}>
            <strong>#</strong>
            <p>Hash: {item.hash}</p>                  
            <p>From: {item.from}</p>
            <p>To: {item.to}</p>
            <p>Gas: {item.gas.toString() }</p>
            <p>Value: {item.value.toString()}</p>
        </tr>
        ))}
        </React.Fragment>
    )
} 

