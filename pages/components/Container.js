import React, { useState, useEffect, act } from 'react'
import Image from 'next/image'
import fonts from '../../styles/Fonts.module.css'


export default function Container() {

	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [errorMessage, setMessage] = useState('');
	const [rows, setRows] = useState(15);
	const [cols, setCols] = useState(15);
	const [numberOfRows, setNumberOfRows] = useState(15);
	const [numberOfCols, setNumberOfCols] = useState(15);
	const [tableData, setTableData] = useState(Array.from({ length: numberOfRows }, () => Array.from({ length: numberOfCols }, () => '')));
	const [assetAddedIndex, setAssetAddedIndex] = useState([]);
	const [cursorIcon, setCursorIcon] = useState('/assets/tiles/svg/tile-10.svg');
	const [zoomValue, setZoomValue] = useState(1);
	const [active, setActive] = useState('');
	const [currentAsset, setCurrentAsset] = useState('/assets/tiles/svg/tile-10.svg')
	const [cursorIndex, setCursorIndex] = useState(0)
	const [isDrawing, setIsDrawing] = useState(false);

	const handleClick = (index) => {
		setActive('draw');
		setCurrentAsset(`/assets/tiles/svg/tile-${index}.svg`);
		setCursorIcon(`/assets/tiles/svg/tile-${index}.svg`);
		setCursorIndex(index)
	};
	
	const handleMouseDown = (rowIndex, colIndex) => {
		setIsDrawing(true);
		if (active === 'erase') {
			eraseAsset(rowIndex, colIndex);
		} else if(active === 'draw') {
			drawImage(rowIndex, colIndex);
		}
	};

	const handleMouseMove = (rowIndex, colIndex) => {
		if (isDrawing) {
			if (active === 'erase') {
				eraseAsset(rowIndex, colIndex);
			} else if(active === 'draw') {
				drawImage(rowIndex, colIndex);
			}
		}
	};

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

	const undoMove = () => {
		setActive('undo');
		setCursorIcon('/assets/icons/arrow.svg');
		const newTableData = [...tableData];
		const lastAsset = assetAddedIndex.pop();
		if (lastAsset) {
			newTableData[lastAsset.rowIndex][lastAsset.colIndex] = '';
		}
		setTableData(newTableData);
	};

	const handleUndoKeyDown = (e) => {
		if (e.key === 'z' && e.ctrlKey) {
			e.preventDefault();
			undoMove();
		}
	};
	
	const getCurrentAsset = () => {
		setCursorIcon(currentAsset);
		setActive('draw')
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
		const newAssetAddedIndex = assetAddedIndex.filter(asset => asset.rowIndex !== rowIndex || asset.colIndex !== colIndex);
		setAssetAddedIndex(newAssetAddedIndex);
	};

	const handleCellClick = (rowIndex, colIndex) => {
		if (active === 'erase') {
			eraseAsset(rowIndex, colIndex);
		} else if(active === 'draw') {
			drawImage(rowIndex, colIndex);
		}
	};
	
	const drawImage = (rowIndex, colIndex) => {
		setActive('draw');
		const newTableData = [...tableData];
		if(rowIndex !== undefined && colIndex !== undefined) {
				tableData[rowIndex][colIndex] === '' ? tableData[rowIndex][colIndex] = [currentAsset] : tableData[rowIndex][colIndex].push(currentAsset);
			}
		setTableData(newTableData);
		if(!assetAddedIndex.find(asset => asset.rowIndex === rowIndex && asset.colIndex === colIndex)) {
			setAssetAddedIndex([...assetAddedIndex, {rowIndex, colIndex}]);
		}
	};

	const handleRowsChange = (e) => {
		setRows(e.target.value);
	};

	const handleColsChange = (e) => {
		setCols(e.target.value);
	};

	const errorMessageDisplay = (dimension, setDimension, message) => {
		setDimension(15);
		setMessage(message);
		setShowErrorMessage(true);
		setTimeout(() => {
			setShowErrorMessage(false);
		}, 1500);
	};

	const apply = () => {

		if(rows < 5)  {
			errorMessageDisplay(5, setRows, 'Rows cannot be less than 5');
			setNumberOfRows(15);
		} else if(rows > 25) {
			errorMessageDisplay(25, setRows, 'Rows cannot be greater than 25');
			setRows(15);
		} else if(cols < 5)  {
			errorMessageDisplay(5, setCols, 'Cols cannot be less than 5');
			setNumberOfCols(15);
		} else if(cols > 25) {
			errorMessageDisplay(25, setCols, 'Cols cannot be greater than 25');
			setNumberOfCols(15);
		} else {
			setNumberOfRows(rows);
			setNumberOfCols(cols);
		}
	};

	useEffect(() => {
		console.log(assetAddedIndex)
	}, [assetAddedIndex])
	
	
	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp);
		
		return () => {
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [tableData]);
	
	
	useEffect(() => {
		window.addEventListener('keydown', handleUndoKeyDown);

		return () => {
			window.removeEventListener('keydown', handleUndoKeyDown);
		};
	}, [tableData]);

  return (
    <main className="flex flex-col items-center w-[100%] bg-white min-h-screen">
		
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
			<ul className='flex gap-5 justify-start pl-3 w-[16%] border-l-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] absolute left-[6.4rem]'> 
						<Image onClick={getCurrentAsset} src={currentAsset} className={`${active === 'draw' ? 'bg-blue-500' : ''} px-2 w-10 hover:cursor-pointer`} width={24} height={24} style={{objectFit: 'contain'}}/>
					<span className='tooltip tooltip-bottom' data-tip="Undo (Ctrl + Z)">
						<Image onClick={undoMove} src={`/assets/icons/undo-icon.svg`} className={`py-[6px] hover:cursor-pointer px-2 ${active === "undo" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
					</span>
					<span className='tooltip tooltip-bottom' data-tip="erase">
					<Image onClick={erase} src={`/assets/icons/rubber-icon.svg`} className={`py-[6px] hover:cursor-pointer px-2 ${active === "erase" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
					</span>
			</ul>
			<ul className='flex gap-5 justify-center w-[7%] border-l-[1px] border-r-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] absolute left-72'> 
				<Image onClick={zoomIn} src={`/assets/icons/zoom-in-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomIn" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
				<Image onClick={zoomOut} src={`/assets/icons/zoom-out-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "zoomOut" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>
			</ul>	
			<ul className='flex gap-5 justify-center w-[4%] border-l-[1px] border-[#7a7a7a] h-[37px] bg-[#212121] float-right'> 
				<Image onClick={handleSettingsClick} src={`/assets/icons/settings-icon.svg`} className={`hover:cursor-pointer px-2 ${active === "settings" ? 'bg-blue-500' : ''} `} width={42} height={42} style={{objectFit: 'contain'}}/>		
					
					{active === 'settings' &&
					<div className='rounded-md px-3 pt-1 w-[15%] h-[250px] bg-[#212121] absolute top-[3.2rem] right-[1rem]'>
						<p className={`${fonts.montSerratMedium} text-[#bbb] text-xl px-3`}> LAYOUT GRID </p>
						
						<div className='flex gap-3'>
							<span>
								<p className={`${fonts.montSerratMedium} text-[#bbb] pt-5 px-3`}> Rows </p>
								<input type="number" className='w-[70px] h-[40px] bg-black rounded-md mx-3 px-1 text-xl text-white' value={rows} min={15} max={25} step={1} onChange={handleRowsChange} placeholder='15' />
							</span>

							<span>
								<p className={`${fonts.montSerratMedium} text-[#bbb] pt-5 px-3`}> cols </p>
								<input type="number" className='w-[70px] h-[40px] bg-black rounded-md mx-3 px-1 text-xl text-white' value={cols} min={15} max={25} step={1} onChange={handleColsChange} placeholder='15' />
							</span>
						</div>

						<button className={`${fonts.montSerratMedium} w-[100px] h-[40px] bg-[#393939] text-white rounded-md mt-5 mx-3 text-[18px] hover:bg-gray-500 transition-all duration-500 hover:cursor-pointer`} onClick={apply}> Apply </button>
						{ showErrorMessage && <p className={`${fonts.montSerratMedium} text-red-500 pt-5 px-3`}> {errorMessage} </p>	}

					</div>
					}

			</ul>	
		</div>

		<div className={`mx-auto ${zoomValue <=1 ? 'pb-16' : 'pb-16'} ${zoomValue >= 1.4 ? 'pt-[280px]' : 'pt-[250px]'} px-[150px]`} style={{ transform: `scale(${zoomValue})`, transformOrigin: 'center center' }}>
			<table className="border-collapse bg-white" style={{borderSpacing: 0}}>
			<thead>
				{Array.from({ length: numberOfRows }).map((_, rowIndex) => (
				<tr key={rowIndex} style={{ borderSpacing: 0 }}>
					{Array.from({ length: numberOfCols }).map((_, colIndex) => (
						<td key={colIndex} className={`relative p-0 m-0 border-collapse whitespace-nowrap`} style={{cursor: `${active === 'undo' ? 'default' : `url(${cursorIcon}), auto`}`, width: '44px', height: '44px', border: '1px solid black', padding: 0, margin: 0 }}
							onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
							onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
						>
							<style jsx>{`
									td:hover {
										background-image: url(${cursorIcon});
										opacity: 0.5;
									}
								`}
							</style>

						{Array.isArray(tableData[rowIndex]?.[colIndex]) &&
									tableData[rowIndex][colIndex].map((image, index) => (
							<Image
								className={`hover:cursor-[url${cursorIcon},_pointer]`}
								key={index}
								src={image}
								width={1}
								height={1}
								alt="Tile"
								style={{ position: 'absolute', top: 0, left: 0, width: '44px', height: '44px', objectFit: 'cover', cursor: `url(${cursorIcon}), auto`, padding: 0, margin: 0 }}
							/>
						))}
				</td>
					))}
				</tr>
				))}
			</thead>
		</table>
	</div>	


		<div className='w-[100vw] h-[40px] bg-[#393939] mt-10 self-end fixed bottom-0 left-[0rem]'> 
			<p className={`text-white px-3 ${fonts.montSerratMedium} pt-1 text-xl text-center w-[5%] h-[40px] bg-[#212121] absolute left-[6.2rem]`}> {Math.round(zoomValue * 100)}% </p>
		</div>

	</main>
  )

}
