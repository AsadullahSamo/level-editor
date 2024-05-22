import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import cursor from '../../styles/Cursor.module.css'
import Feature from './Feature';
import fonts from '../../styles/Fonts.module.css'
import Dialog from './Dialog';

export default function Container() {

	const [tableData, setTableData] = useState(Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => '')));
	const [cursorIcon, setCursorIcon] = useState('/assets/tiles/svg/tile-10.svg');
	const [zoomValue, setZoomValue] = useState(1);
	const [xCoord, setXCoord] = useState(0);
	const [yCoord, setYCoord] = useState(0);
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
	
	const handleMouseDown = (rowIndex, colIndex) => {
		setIsDrawing(true);
		if (active === 'erase') {
			eraseAsset(rowIndex, colIndex);
		} else {
			drawImage(rowIndex, colIndex);
		}
	};

    const handleMouseMove = (rowIndex, colIndex) => {
			if (!isDrawing) return;
			if (active === 'erase') {
				eraseAsset(rowIndex, colIndex);
			} else {
				drawImage(rowIndex, colIndex);
			}
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

	const undoMove = () => {
		setActive('undo');
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

	const erase = () => {
		setActive('erase');
		setCursorIcon('/assets/icons/rubber-icon.svg');
    // const newTableData = [...tableData];
    // newTableData[rowIndex][colIndex] = '';
    // setTableData(newTableData);
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

	const handleSettingsClick = () => {
		setActive('settings');
	};


	const eraseAsset = (rowIndex, colIndex) => {
		const newTableData = [...tableData];
		if(rowIndex !== undefined && colIndex !== undefined && tableData[rowIndex][colIndex] !== '') {
			newTableData[rowIndex][colIndex] = '';
		}
		setTableData(newTableData);
	};

	const handleCellClick = (rowIndex, colIndex) => {
    if (active === 'erase') {
				eraseAsset(rowIndex, colIndex);
    } else {
        drawImage(rowIndex, colIndex);
    }
	};
	
	const drawImage = (rowIndex, colIndex) => {
		// console.log(rowIndex, colIndex);
    setActive('draw');
    const newTableData = [...tableData];
    if(rowIndex !== undefined && colIndex !== undefined) {
			tableData[rowIndex][colIndex] === '' ? tableData[rowIndex][colIndex] = [currentAsset] : tableData[rowIndex][colIndex].push(currentAsset);
		}
    setTableData(newTableData);
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
    <main className="flex flex-col items-center overflow-auto">
		
		<div className='fixed left-0 w-[100px] h-[100%] bg-[#212121] flex flex-col flex-wrap gap-3 justify-center items-center' style={{zIndex: 10}}> 
			{Array.from({ length: 16 }).map((_, index) => (
				<div key={index} className='flex gap-3'>
					<Image onClick={() => handleClick((index*2)+1)} src={`/assets/tiles/png/tile-${(index*2)+1}.png`} className={`${(index*2)+1 === (cursorIndex) ? 'border-4 border-red-500' : ''} hover:cursor-pointer`} alt={`Tile ${(index*2)+1}`} width={28} height={28} style={{objectFit: 'contain'}}/>
					<Image onClick={() => handleClick((index*2)+2)} src={`/assets/tiles/png/tile-${(index*2)+2}.png`} className={`${(index*2) === cursorIndex-2 ? 'border-4 border-red-500' : ''} hover:cursor-pointer`} alt={`Tile ${(index*2)+2}`} width={28} height={28} style={{objectFit: 'contain'}}/>
				</div>
			))}
		</div>

		{/* Features */}
		<div className='w-[100%] h-[40px] bg-[#393939] fixed top-[0%] border-[1px] border-[#7a7a7a]' style={{zIndex: 10}}>
			<ul className='flex gap-5 justify-start pl-3 w-[15%] border-l-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] absolute left-[6.4rem]'> 
					<Image onClick={getCurrentAsset} src={currentAsset} className={`hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
					<Image onClick={undoMove} title='undo (Ctrl + Z)' popovertarget="mypopover" src={`/assets/icons/undo-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "undo" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
					<Image onClick={erase} title='erase' src={`/assets/icons/rubber-icon.svg`} className={`hover:cursor-pointer px-2 w-10 -mx-2 ${active === "erase" ? 'bg-blue-500' : ''} `} width={67} height={67} style={{objectFit: 'contain'}}/>
			</ul>
			<ul className='flex gap-5 justify-center w-[7%] border-l-[1px] border-r-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] absolute left-64'> 
				<Image onClick={zoomIn} src={`/assets/icons/zoom-in-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomIn" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
				<Image onClick={zoomOut} src={`/assets/icons/zoom-out-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomOut" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
			</ul>	
			<ul className='flex gap-5 justify-center w-[4%] border-l-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] float-right'> 
				<Image onClick={handleSettingsClick} src={`/assets/icons/settings-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "settings" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
			</ul>	
		</div>

		
	  <table className="border-collapse mx-auto my-32 bg-white" style={{borderSpacing: 0, zoom: zoomValue, tableLayout: 'auto' }}>
		<thead>
			{Array.from({ length: 25 }).map((_, rowIndex) => (
			<tr key={rowIndex} style={{ borderSpacing: 0 }}>
				{Array.from({ length: 25 }).map((_, colIndex) => (
					<td key={colIndex} className='relative p-0 m-0 border-collapse whitespace-nowrap' style={{ cursor: `url(${cursorIcon}), auto`, width: '64px', height: '64px', border: '1px solid black', padding: 0, margin: 0 }}
						onClick={() => handleCellClick(rowIndex, colIndex)}
						onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
						onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
					>
					 {Array.isArray(tableData[rowIndex]?.[colIndex]) &&
                tableData[rowIndex][colIndex].map((image, index) => (
						<Image
							className={`hover:cursor-[url${cursorIcon},_pointer]`}
							key={index}
							src={image}
							width={1}
							height={1}
							alt="Tile"
							style={{ position: 'absolute', top: 0, left: 0, width: '64px', height: '64px', objectFit: 'cover', cursor: `url(${cursorIcon}), auto`, padding: 0, margin: 0 }}
						/>
					))}
			</td>
				))}
			</tr>
			))}
		</thead>
	</table>
	




				

				
		{/* {images && images.map((image, index) => (
			<React.Fragment key={index}>
				<Image className={`hover:cursor-[url${cursorIcon},_pointer]`} src={image.src} width={1} height={1} alt="Tile" style={{width: '32px', height: '32px', position: 'absolute', objectFit: 'contain', top: `${image.y}px`, left: `${image.x}px`, cursor: `url(${cursorIcon}), auto`, zIndex: 10}}/>
			</React.Fragment>
		))} */}


		{/* </div> */}

		<div className='w-[100vw] h-[40px] bg-[#393939] mt-10 self-end fixed bottom-0 left-[0rem]'> 
			<p className={`text-white px-3 ${fonts.montSerratMedium} pt-1 text-xl text-center w-[5%] h-[40px] bg-[#212121] absolute left-[6.2rem]`}> {Math.round(zoomValue * 100)}% </p>
		</div>

	</main>
  )

}
