import React from 'react'

export default function Container() {

	const numberOfColumns = 15
  
  return (
    
    
      <table className='w-[60%] h-[500px] bg-white'>
					{Array.from({ length: numberOfColumns }).map((_, index) => (
						<tr className='border-[1px] border-black'>
							{Array.from({ length: numberOfColumns }).map((_, index) => (
								<td key={index} className='border-[1px] border-black'> </td>
							))}
						</tr>
					))}
    	</table>

  )

}
