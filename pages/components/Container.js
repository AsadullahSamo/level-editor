import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import cursor from '../../styles/Cursor.module.css'
import Feature from './Feature';
import fonts from '../../styles/Fonts.module.css'

export default function Container() {
  
	const [cursorIcon, setCursorIcon] = useState('/assets/tiles/svg/tile-10.svg');
	const [zoomValue, setZoomValue] = useState(1);
	const [isEraserSelected, setIsEraserSelected] = useState(false);
	const [active, setActive] = useState('');
	const [currentAsset, setCurrentAsset] = useState('/assets/tiles/svg/tile-10.svg')
	const [cursorIndex, setCursorIndex] = useState(0)
	const [isDrawing, setIsDrawing] = useState(false)
	const [images, setImages] = useState([])

	const handleClick = (index) => {
		setActive('');
		setCurrentAsset(`/assets/tiles/svg/tile-${index}.svg`);
		setCursorIcon(`/assets/tiles/svg/tile-${index}.svg`);
		setCursorIndex(index)
	};

	const handleTableClick = (e) => {
		if (active === 'erase') {
			erase(e);
		} else {
			drawImage(e);
		}
	};

	const drawImage = (e) => {
		const table = e.target;
		const rect = table.getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;
		const right = rect.right;
		setImages([...images, {src: cursorIcon, x, y}])
	};
	
	const handleMouseDown = (e) => {
		setIsDrawing(true);
		if (active === 'erase') {
			erase(e);
		} else {
			drawImage(e);
		}
	};

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
		if (active === 'erase') {
			erase(e);
		} else {
        	drawImage(e);
		}
		
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

	const undoMove = () => {
		setImages(images.slice(0, -1)) // remove the last element by returning a new array with all elements except the last one
	};

	const handleUndoKeyDown = (e) => {
		if (e.key === 'z' && e.ctrlKey) {
			undoMove();
		}
	};
	
	const getCurrentAsset = () => {
		setCursorIcon(currentAsset);
		setActive('')
	};

	const erase = (e) => {
		setActive('erase');
		setCursorIcon('/assets/icons/rubber-icon.svg');
		const table = e.target;
		const rect = table.getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;
		const right = rect.right;
		const threshold = 16       /* This value is half the size of image size (in this case 16 which is 32/2) so if distance matches it image will be erased*/
		setImages(images.filter((image) => {
			const distanceX = Math.abs(image.x - x);     /* This will calculate the distance between the image and the mouse pointer for x and y axis */
			const distanceY = Math.abs(image.y - y);
			return distanceX > threshold || distanceY > threshold;
		}));
	};
	
	const zoomIn = () => {
		setActive('zoomIn');
		if(zoomValue < 1.5) 
			setZoomValue(zoomValue + 0.1);
		else 
			setZoomValue(1.5);
	};

	const zoomOut = () => {
		setActive('zoomOut');
		if(zoomValue > 0.5) 
			setZoomValue(zoomValue - 0.1);
		else 
			setZoomValue(0.5);
	};

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);
	
	useEffect(() => {
		window.addEventListener('keydown', handleUndoKeyDown);

		return () => {
			window.removeEventListener('keydown', handleUndoKeyDown);
		};
	}, [images]);

  return (
    <main className="flex flex-col items-center">
		{/* Features */}
		<div className='w-[100%] h-[40px] bg-[#393939] absolute top-[0%]'>
			<ul className='flex gap-5 justify-center w-[10%] border-2 border-white h-[40px] bg-[#212121] absolute left-[6.4rem]'> 
					<Image onClick={getCurrentAsset} src={currentAsset} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
					<Image onClick={undoMove} title='undo (Ctrl + Z)' popovertarget="mypopover" src={`/assets/icons/undo-icon.svg`} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
					<Image onClick={erase} title='erase' src={`/assets/icons/rubber-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "erase" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
			</ul>
			<ul className='flex gap-5 justify-center w-[7%] border-2 border-white h-[40px] bg-[#212121] absolute left-64'> 
				<Image onClick={zoomIn} src={`/assets/icons/zoom-in-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomIn" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
				<Image onClick={zoomOut} src={`/assets/icons/zoom-out-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomOut" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
			</ul>	
		 </div>

		
		<div className='w-[100%] h-[40px] bg-[#393939] absolute bottom-[0%]'> 
			<p className={`text-white px-3 ${fonts.montSerratMedium} pt-1 text-xl text-center w-[5%] h-[40px] bg-[#212121] absolute left-[6.2rem]`}> 100% </p>
		</div>
		
		<div className='w-[100px] h-[100%] bg-[#212121] absolute left-[0%] top-[0%] flex flex-col flex-wrap gap-3 justify-center items-center'> 
			{Array.from({ length: 15 }).map((_, index) => (
				<div key={index} className='flex gap-3'>
					<Image onClick={() => handleClick((index*2)+1)} src={`/assets/tiles/png/tile-${(index*2)+1}.png`} className={`${(index*2)+1 === (cursorIndex) ? 'border-4 border-red-500' : ''} hover:cursor-pointer`} alt={`Tile ${(index*2)+1}`} width={32} height={32} style={{objectFit: 'contain'}}/>
					<Image onClick={() => handleClick((index*2)+2)} src={`/assets/tiles/png/tile-${(index*2)+2}.png`} className={`${(index*2) === cursorIndex-2 ? 'border-4 border-red-500' : ''} hover:cursor-pointer`} alt={`Tile ${(index*2)+2}`} width={32} height={32} style={{objectFit: 'contain'}}/>
				</div>
			))}
		</div>

			
		<table onMouseMove={handleMouseMove} onClick={handleTableClick} onMouseDown={handleMouseDown} className={`w-[60vw] h-[500px] bg-white`} style={{ cursor: `url(${cursorIcon}), auto`, zoom: zoomValue }}>
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

			{images && images.map((image, index) => (
				<React.Fragment key={index}>
					<Image className={`hover:cursor-[url${cursorIcon},_pointer]`} src={image.src} width={1} height={1} alt="Tile" style={{width: '32px', height: '32px', position: 'absolute', objectFit: 'contain', top: `${image.y}px`, left: `${image.x}px`, cursor: `url(${cursorIcon}), auto`, zIndex: 10}}/>
				</React.Fragment>
			))}
	</main>
  )

}
