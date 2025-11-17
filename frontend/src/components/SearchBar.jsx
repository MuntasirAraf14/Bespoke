import React from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const {search, setSearch, showSearch,setShowSearch} = React.useContext(ShopContext);
    const [visible, setVisible] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisible(true);
        }else{
            setVisible(false);
        }
    }, [location]);

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
            <input 
                type="text" 
                placeholder='Search for products...' 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='bg-inherit flex-1 w-full outline-none text-sm'
            />
                <img src={assets.search_icon} alt="Search" className='w-4 h-4'/>
        </div>
        <img onClick={()=>setShowSearch(false)} src={assets.cross_icon} alt="Close" className='w-3 inline cursor-pointer'/>
    </div>
  ) : null
}

export default SearchBar