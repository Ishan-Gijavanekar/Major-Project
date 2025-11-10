import React from 'react'
import { useContractStore } from '../../../stores/contractStore'

const GetAllMilestone = () => {
  const {getMyContracts}=useContractStore()
  const data=getMyContracts()
  console.log(data);
  
  return (
    <div>

      <h1>cydagcayhgcdayhcgad</h1>
    </div>
  )
}

export default GetAllMilestone
