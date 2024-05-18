import React from 'react'
import Image from 'next/image'

export default function Feature( {cursorIcon} ) {


  return (
    
    <>
        <ul className='flex gap-5 justify-center w-[10%] border-2 border-white h-[40px] bg-[#212121] absolute left-[6.4rem]'> 
            <Image src={cursorIcon} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
            <Image title='undo' popovertarget="mypopover" src={`/assets/icons/undo-icon.svg`} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
            <Image title='erase' src={`/assets/icons/rubber-icon.svg`} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
        </ul>
        <ul className='flex gap-5 justify-center w-[7%] border-2 border-white h-[40px] bg-[#212121] absolute left-64'> 
            <Image src={`/assets/icons/zoom-in-icon.svg`} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
            <Image src={`/assets/icons/zoom-out-icon.svg`} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
        </ul>		
    </>
  )
}
