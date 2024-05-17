import React from 'react'

export default function Container() {
  
  return (
    
    
      <table className='w-[60%] h-[500px] bg-white'>
				<thead>
					{Array.from({ length: 15 }).map((_, index) => (
						<tr key={index} className='border-[1px] border-black'>
							{Array.from({ length: 15 }).map((_, index) => (
								<td key={index} className='border-[1px] border-black'> </td>
							))}
						</tr>
					))}
				</thead>
    	</table>

  )

}
