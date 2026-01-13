

export const cleanParams = (queryParams)=>
Object.fromEntries(
  Object.entries(queryParams).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  )
);