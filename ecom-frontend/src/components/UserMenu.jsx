import { Avatar, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { BiUser } from 'react-icons/bi';
import { FaUserShield } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BackDrop from './BackDrop';
import { performUserLogout } from '../store/actions';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { currentUser } = useSelector((state) => state.authentication);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAdmin = currentUser && currentUser?.roles.includes("ROLE_ADMIN");

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logOutHandler = () => {
        dispatch(performUserLogout(navigate));
    };

    return (
      <div className='relative z-30'>
        <div
          className='border-2 border-red-600 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-xl hover:border-red-700 transition-all duration-300 p-0.5 bg-white'
          onClick={handleClick}
        >
          <Avatar
            alt={currentUser?.username}
            src=''
            sx={{
              bgcolor: '#dc2626',
              width: 40,
              height: 40,
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {currentUser?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </div>
        <Menu
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.15)',
              border: '1px solid #fee2e2',
              minWidth: '280px',
              marginTop: '8px'
            }
          }}
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            sx: { padding: '12px' },
          }}
        >
          <div className='px-5 py-4 border-b border-red-100 mb-3'>
            <p className='text-sm text-gray-500 mb-1'>Signed in as</p>
            <p className='font-bold text-red-700 text-lg'>{currentUser?.username}</p>
          </div>

          <Link to="/profile">
            <MenuItem
              className="flex gap-3 rounded-lg hover:bg-red-50 transition-colors mx-2 my-1"
              onClick={handleClose}
              sx={{ padding: '12px 14px' }}
            >
              <BiUser className='text-2xl text-red-600'/>
              <span className='font-semibold text-gray-700'>
                My Profile
              </span>
            </MenuItem>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <MenuItem
                className="flex gap-3 rounded-lg hover:bg-red-50 transition-colors mx-2 my-1"
                onClick={handleClose}
                sx={{ padding: '12px 14px' }}
              >
                <FaUserShield className='text-2xl text-red-600'/>
                <span className='font-semibold text-gray-700'>
                  Admin Panel
                </span>
              </MenuItem>
            </Link>
          )}

          <div className='border-t border-red-100 mt-3 pt-3 px-2'>
            <MenuItem
              className="flex gap-3 rounded-lg hover:bg-red-600 transition-all mx-0 my-1 bg-red-50"
              onClick={logOutHandler}
              sx={{ padding: '12px 14px' }}
            >
              <IoExitOutline className='text-2xl text-red-700'/>
              <span className='font-bold text-red-700'>
                Log Out
              </span>
            </MenuItem>
          </div>
        </Menu>

        {open && <BackDrop />}
      </div>
    );
}

export default UserMenu