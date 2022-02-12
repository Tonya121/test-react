import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import instance from "../api/api";

type Props = {
  setJoke: (event: React.MouseEvent<HTMLElement>) => void
};

const CategoriesButton = ({ setJoke }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchCategories = React.useCallback(() => {
    instance.get(`/categories`)
      .then((response) => {
        localStorage.setItem("categories", JSON.stringify(response?.data));
      })
      .catch(err => {
        console.log(err)
      })
  }, []);

  React.useEffect(() => {
    const categoriesList = localStorage.getItem("categories");
    if (categoriesList) return;
    fetchCategories();
  }, [fetchCategories]);

  const getCategory = React.useCallback((category) => {
    instance.get(`random?category=${category}`)
      .then((response) => {
        localStorage.setItem("jokes", JSON.stringify(response?.data));
        setJoke(response?.data)
      })
      .catch(err => {
        console.log(err)
      })
    handleClose()
  }, []);

  const data = React.useMemo(() => localStorage.getItem("categories"), [])
  const categories = data ? JSON.parse(data) : null;

  return (
    <div>
      <Button
        id="positioned-button"
        aria-controls={open ? 'positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Choose Category
      </Button>
      <Menu
        id="positioned-menu"
        aria-labelledby="positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {categories?.map((category: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
          <MenuItem onClick={() => getCategory(category)} key={index}>{category}</MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default CategoriesButton;

